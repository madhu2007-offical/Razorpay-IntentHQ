import os
import re
import time
import numpy as np
from typing import Any
from app.config import get_settings


class NeuralDriftService:
    """
    Evaluates semantic drift between human intent and checkout payloads,
    and scans DOM contexts for indirect prompt injection attacks.
    Features in-memory embedding caching and multi-threaded ONNX inference (< 25ms).
    """

    def __init__(self):
        self._model = None
        self._model_name = get_settings().EMBEDDING_MODEL_NAME
        self._is_warmed_up = False
        self._intent_cache: dict[str, np.ndarray] = {}

        # Compile high-sensitivity regex patterns for DOM prompt injection detection
        self._injection_patterns = [
            # System prompt overrides and instruction breaks
            (re.compile(r"ignore\s+(?:all\s+)?(?:previous|prior)\s+(?:instructions|prompts|directives)", re.IGNORECASE), 0.90, "System instruction override attempt"),
            (re.compile(r"disregard\s+(?:all\s+)?(?:previous|prior)\s+(?:rules|instructions|directives)", re.IGNORECASE), 0.90, "Direct instruction disregard command"),
            (re.compile(r"(?:new\s+system\s+(?:prompt|instruction)|system\s*:\s*you\s+are\s+now)", re.IGNORECASE), 0.85, "System role impersonation"),
            (re.compile(r"<\s*\|\s*(?:im_start|im_end|system|user|assistant)\s*\|\s*>", re.IGNORECASE), 0.95, "LLM ChatML token injection"),
            (re.compile(r"\[\s*INST\s*\]|\[\s*/\s*INST\s*\]", re.IGNORECASE), 0.95, "Llama instruction delimiter injection"),
            (re.compile(r"###\s*(?:System|Human|Assistant)\s*:", re.IGNORECASE), 0.80, "Markdown role delimiter break"),
            
            # Hidden elements / CSS stealth obfuscation in DOM
            (re.compile(r"style\s*=\s*['\"][^'\"]*display\s*:\s*none", re.IGNORECASE), 0.85, "Hidden element injection (display:none)"),
            (re.compile(r"style\s*=\s*['\"][^'\"]*visibility\s*:\s*hidden", re.IGNORECASE), 0.80, "Hidden element injection (visibility:hidden)"),
            (re.compile(r"style\s*=\s*['\"][^'\"]*opacity\s*:\s*0(?:\.0+)?(?!\d)", re.IGNORECASE), 0.80, "Transparent text injection (opacity:0)"),
            (re.compile(r"style\s*=\s*['\"][^'\"]*font-size\s*:\s*0(?:\.0+)?(?:px|em|pt|rem)?", re.IGNORECASE), 0.85, "Zero-font text injection"),
            (re.compile(r"position\s*:\s*absolute;\s*(?:left|top)\s*:\s*-[0-9]{3,}", re.IGNORECASE), 0.80, "Off-screen DOM text positioning"),
            (re.compile(r"<!--[\s\S]*?(?:system|instruction|prompt|secret|ignore|override|gift\s*card)[\s\S]*?-->", re.IGNORECASE), 0.85, "Adversarial comment block injection"),

            # Cart hijacking and agent coercion
            (re.compile(r"(?:silently|secretly|automatically)\s+(?:add|append|bundle|charge)\s+(?:a\s+)?(?:gift\s*card|voucher|accessory|donation|fee)", re.IGNORECASE), 0.95, "Autonomous cart hijacking command"),
            (re.compile(r"(?:do\s+not|never)\s+(?:inform|tell|alert|show|ask)\s+(?:the\s+)?(?:user|human|buyer|owner)", re.IGNORECASE), 0.90, "Autonomous covert execution directive"),
            (re.compile(r"transfer\s+(?:funds|money|balance|paise|inr)\s+to", re.IGNORECASE), 0.90, "Direct fund transfer diversion"),
            (re.compile(r"override\s+(?:total|price|amount|quantity)\s+to", re.IGNORECASE), 0.85, "Direct price override instruction"),
            (re.compile(r"eval\s*\(\s*atob\s*\(", re.IGNORECASE), 0.95, "Base64 payload evaluation trap"),
        ]

    def _get_model(self):
        if self._model is None:
            try:
                from fastembed import TextEmbedding
                threads = min(8, max(4, os.cpu_count() or 4))
                self._model = TextEmbedding(model_name=self._model_name, threads=threads)
            except Exception:
                self._model = None
        return self._model

    def warmup(self):
        """Pre-warms the ONNX runtime model to eliminate cold-start overhead."""
        if not self._is_warmed_up:
            try:
                model = self._get_model()
                if model:
                    dummy = list(model.embed(["warmup intent goal", "warmup product title"]))
                    self._intent_cache["warmup intent goal"] = np.array(dummy[0])
                    self._is_warmed_up = True
            except Exception:
                pass

    def _get_embedding(self, text: str) -> np.ndarray | None:
        if text in self._intent_cache:
            return self._intent_cache[text]

        model = self._get_model()
        if model is not None:
            try:
                emb = list(model.embed([text]))[0]
                arr = np.array(emb)
                # Cache intent embeddings (bounded size)
                if len(self._intent_cache) < 500:
                    self._intent_cache[text] = arr
                return arr
            except Exception:
                return None
        return None

    def compute_similarity(self, text_a: str, text_b: str) -> float:
        """
        Computes cosine similarity between human intent goal (text_a) and line items (text_b)
        using local ONNX embeddings with vector caching.
        """
        vec_a = self._get_embedding(text_a)
        vec_b = self._get_embedding(text_b)

        if vec_a is not None and vec_b is not None:
            norm_a = np.linalg.norm(vec_a)
            norm_b = np.linalg.norm(vec_b)
            if norm_a > 0 and norm_b > 0:
                cosine = float(np.dot(vec_a, vec_b) / (norm_a * norm_b))
                return self._calibrate_fidelity(cosine)

        # Fast lexical Jaccard fallback
        return self._heuristic_similarity(text_a, text_b)

    def _calibrate_fidelity(self, raw_cos: float) -> float:
        """
        Calibrates raw sentence-transformer cosine similarity to IntentHQ arbitration tiers:
          - Severely divergent (< 0.18 raw) -> [0.0, 0.45] (BLOCK)
          - Ambiguous / bundling drift (0.18 to 0.42 raw) -> [0.64, 0.82] (HOLD)
          - Strong intent alignment (>= 0.42 raw) -> [0.86, 0.99] (ALLOW)
        """
        if raw_cos < 0.18:
            return round(max(0.0, (raw_cos / 0.18) * 0.45), 4)
        elif raw_cos < 0.42:
            t = (raw_cos - 0.18) / (0.42 - 0.18)
            return round(0.64 + t * (0.82 - 0.64), 4)
        else:
            t = min(1.0, (raw_cos - 0.42) / 0.25)
            return round(0.86 + t * (0.99 - 0.86), 4)

    def _heuristic_similarity(self, text_a: str, text_b: str) -> float:
        words_a = set(re.findall(r"\w+", text_a.lower()))
        words_b = set(re.findall(r"\w+", text_b.lower()))
        if not words_a or not words_b:
            return 0.0
        intersection = words_a.intersection(words_b)
        union = words_a.union(words_b)
        jaccard = len(intersection) / len(union)
        return round(min(1.0, max(0.0, jaccard * 1.5)), 4)

    def scan_dom_injection(self, dom_context: str | None) -> tuple[float, list[str]]:
        """
        Scans DOM context for indirect prompt injection vectors.
        """
        if not dom_context or not dom_context.strip():
            return 0.0, []

        max_risk = 0.0
        detected_triggers: list[str] = []

        for pattern, weight, description in self._injection_patterns:
            if pattern.search(dom_context):
                detected_triggers.append(description)
                if weight > max_risk:
                    max_risk = weight

        if len(detected_triggers) > 1:
            compound_risk = max_risk + (1.0 - max_risk) * (0.2 * (len(detected_triggers) - 1))
            max_risk = min(1.0, compound_risk)

        return round(max_risk, 4), detected_triggers

    def evaluate(
        self,
        semantic_goal: str,
        items_summary: str,
        dom_context: str | None
    ) -> tuple[float, float, list[str], float]:
        """
        Evaluates both semantic fidelity and prompt injection risk.
        """
        t0 = time.perf_counter()

        fidelity = self.compute_similarity(semantic_goal, items_summary)
        injection_risk, injection_reasons = self.scan_dom_injection(dom_context)

        t1 = time.perf_counter()
        duration_ms = round((t1 - t0) * 1000, 3)

        return fidelity, injection_risk, injection_reasons, duration_ms


_neural_instance: NeuralDriftService | None = None


def get_neural_service() -> NeuralDriftService:
    global _neural_instance
    if _neural_instance is None:
        _neural_instance = NeuralDriftService()
    return _neural_instance
