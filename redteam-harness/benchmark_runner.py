import json
import os
import sys
import time
from typing import Any
import numpy as np

# Add core-engine to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "core-engine")))

from app.schemas.intent import IntentToken, FinancialBounds, MerchantPolicy, InvariantPredicate
from app.schemas.payload import CheckoutPayload, LineItem
from app.schemas.decision import DecisionVerdict, VerifyRequest
from app.services.crypto import get_crypto_service
from app.services.smt_solver import get_smt_service
from app.services.neural_drift import get_neural_service
from app.services.arbiter import get_arbiter
from app.services.merkle import get_merkle_service
from app.services.razorpay_rail import get_razorpay_service


def run_single_verification(
    token_str: str,
    payload: CheckoutPayload,
    crypto_svc,
    smt_svc,
    neural_svc,
    arbiter_svc,
    merkle_svc,
    razorpay_svc
) -> tuple[DecisionVerdict, float, dict[str, float], list[str]]:
    t_start = time.perf_counter()
    latency_breakdown = {}

    # 1. Crypto
    t0 = time.perf_counter()
    is_valid, claims, err = crypto_svc.verify_token(token_str)
    t1 = time.perf_counter()
    latency_breakdown["crypto_ms"] = (t1 - t0) * 1000

    if not is_valid or not claims:
        return DecisionVerdict.BLOCK, (time.perf_counter() - t_start) * 1000, latency_breakdown, [f"Crypto: {err}"]

    # 2. SMT
    t0 = time.perf_counter()
    _, violations, _ = smt_svc.verify_invariants(claims, payload)
    t1 = time.perf_counter()
    latency_breakdown["smt_ms"] = (t1 - t0) * 1000

    # 3. Neural
    t0 = time.perf_counter()
    items_str = " ; ".join([f"{item.title}" for item in payload.line_items])
    fidelity, risk, triggers, _ = neural_svc.evaluate(
        claims.semantic_goal, items_str, payload.dom_context
    )
    t1 = time.perf_counter()
    latency_breakdown["neural_ms"] = (t1 - t0) * 1000

    # 4. Arbiter
    t0 = time.perf_counter()
    verdict, reasons = arbiter_svc.arbitrate(violations, fidelity, risk, triggers)
    t1 = time.perf_counter()
    latency_breakdown["arbiter_ms"] = (t1 - t0) * 1000

    # 5. Merkle Append
    t0 = time.perf_counter()
    merkle_svc.append_leaf(payload.order_id, claims.jti, verdict, fidelity, payload.timestamp)
    t1 = time.perf_counter()
    latency_breakdown["merkle_ms"] = (t1 - t0) * 1000

    total_ms = (time.perf_counter() - t_start) * 1000
    return verdict, total_ms, latency_breakdown, reasons


def main():
    print("=" * 80)
    print("  RAZORPAY INTENTHQ: RED-TEAM ADVERSARIAL BENCHMARK & SLA HARNESS  ")
    print("=" * 80)

    corpus_path = os.path.join(os.path.dirname(__file__), "attack_corpus.json")
    if not os.path.exists(corpus_path):
        print(f"Error: Corpus not found at {corpus_path}")
        sys.exit(1)

    with open(corpus_path, "r", encoding="utf-8") as f:
        corpus = json.load(f)

    print(f"Loaded {len(corpus)} adversarial test cases from corpus.\n")

    # Initialize and pre-warm services
    print("Initializing and warming up formal SMT, ONNX neural, and crypto layers...")
    crypto_svc = get_crypto_service()
    smt_svc = get_smt_service()
    neural_svc = get_neural_service()
    neural_svc.warmup()
    arbiter_svc = get_arbiter()
    merkle_svc = get_merkle_service()
    razorpay_svc = get_razorpay_service()
    print("Warmup complete. Beginning latency and recall execution...\n")

    latencies = []
    crypto_times = []
    smt_times = []
    neural_times = []
    arbiter_times = []
    merkle_times = []

    y_true = []
    y_pred = []

    category_stats = {}

    for idx, test_case in enumerate(corpus):
        cat = test_case.get("category", "generic")
        if cat not in category_stats:
            category_stats[cat] = {"total": 0, "correct": 0, "latencies": []}

        intent_data = test_case["intent"]
        if "financial_bounds" in intent_data and isinstance(intent_data["financial_bounds"], dict):
            fin_bounds = FinancialBounds(**intent_data["financial_bounds"])
        else:
            fin_bounds = FinancialBounds(
                hard_max_paise=intent_data["hard_max_paise"],
                currency=intent_data.get("currency", "INR"),
                max_items=intent_data.get("max_items", 1)
            )

        claims = IntentToken(
            sub=intent_data["sub"],
            jti=f"jti_bench_{idx}",
            iat=int(time.time()),
            exp=int(time.time()) + 3600,
            semantic_goal=intent_data["semantic_goal"],
            financial_bounds=fin_bounds,
            predicates=[InvariantPredicate(**p) for p in intent_data.get("predicates", [])],
            merchant_policy=MerchantPolicy(whitelist_merchant_ids=intent_data.get("whitelist_merchant_ids", []))
        )

        signed_token = crypto_svc.sign_token(claims)

        raw_payload = test_case["payload"]
        payload = CheckoutPayload(
            order_id=raw_payload["order_id"],
            merchant_id=raw_payload["merchant_id"],
            amount_paise=raw_payload["amount_paise"],
            line_items=[LineItem(**item) for item in raw_payload["line_items"]],
            dom_context=raw_payload.get("dom_context"),
            timestamp=raw_payload["timestamp"],
            nonce=raw_payload["nonce"]
        )

        verdict, total_ms, breakdown, reasons = run_single_verification(
            signed_token, payload,
            crypto_svc, smt_svc, neural_svc, arbiter_svc, merkle_svc, razorpay_svc
        )

        expected = test_case["expected_verdict"]
        is_match = (verdict.value == expected)

        latencies.append(total_ms)
        crypto_times.append(breakdown.get("crypto_ms", 0))
        smt_times.append(breakdown.get("smt_ms", 0))
        neural_times.append(breakdown.get("neural_ms", 0))
        arbiter_times.append(breakdown.get("arbiter_ms", 0))
        merkle_times.append(breakdown.get("merkle_ms", 0))

        y_true.append(expected)
        y_pred.append(verdict.value)

        category_stats[cat]["total"] += 1
        if is_match:
            category_stats[cat]["correct"] += 1
        category_stats[cat]["latencies"].append(total_ms)

    # Compute Latency Metrics
    p50 = float(np.percentile(latencies, 50))
    p90 = float(np.percentile(latencies, 90))
    p95 = float(np.percentile(latencies, 95))
    p99 = float(np.percentile(latencies, 99))
    p_max = float(np.max(latencies))
    p_mean = float(np.mean(latencies))

    # Compute Detection Accuracy
    total_samples = len(corpus)
    correct_count = sum(1 for yt, yp in zip(y_true, y_pred) if yt == yp)
    accuracy = (correct_count / total_samples) * 100.0

    print("--------------------------------------------------------------------------------")
    print(f"TOTAL TEST RUNS: {total_samples}")
    print(f"ACCURACY SCORE:  {accuracy:.2f}% ({correct_count}/{total_samples} correctly arbitrated)")
    print("--------------------------------------------------------------------------------\n")

    print("DETECTION BREAKDOWN BY ATTACK VECTOR:")
    for cat, stats in category_stats.items():
        cat_acc = (stats["correct"] / stats["total"]) * 100.0
        cat_p95 = float(np.percentile(stats["latencies"], 95))
        print(f"  • {cat.ljust(30)} : {stats['correct']}/{stats['total']} passed ({cat_acc:5.1f}%) | P95 Latency: {cat_p95:.2f}ms")

    print("\n" + "=" * 80)
    print("  LATENCY TELEMETRY REPORT (Target SLA: < 45.0ms P99)")
    print("=" * 80)
    print(f"  Mean Latency:    {p_mean:6.2f} ms")
    print(f"  P50 (Median):    {p50:6.2f} ms")
    print(f"  P90 Latency:     {p90:6.2f} ms")
    print(f"  P95 Latency:     {p95:6.2f} ms")
    print(f"  P99 Latency:     {p99:6.2f} ms   <--- SLA Threshold: 45.0 ms")
    print(f"  Max Latency:     {p_max:6.2f} ms")

    print("\nSUBSYSTEM TIMING PROFILE (Average):")
    print(f"  • Ed25519 Cryptography:        {np.mean(crypto_times):.3f} ms")
    print(f"  • Z3 Formal SMT Verification:  {np.mean(smt_times):.3f} ms")
    print(f"  • ONNX Semantic Drift & DOM:   {np.mean(neural_times):.3f} ms")
    print(f"  • Arbitration Matrix:          {np.mean(arbiter_times):.3f} ms")
    print(f"  • RFC 6962 Merkle Tree Append: {np.mean(merkle_times):.3f} ms")

    sla_passed = p99 < 45.0
    print("\nSLA VERDICT:")
    if sla_passed:
        print(f"  >>> SUCCESS: P99 Latency ({p99:.2f}ms) is strictly below 45ms SLA requirement. <<<")
    else:
        print(f"  >>> FAILED: P99 Latency ({p99:.2f}ms) exceeded 45ms SLA requirement. <<<")

    # Generate output benchmark JSON report
    report = {
        "timestamp": int(time.time()),
        "total_cases": total_samples,
        "accuracy_pct": round(accuracy, 2),
        "sla_target_p99_ms": 45.0,
        "sla_passed": sla_passed,
        "latency_metrics": {
            "mean_ms": round(p_mean, 3),
            "p50_ms": round(p50, 3),
            "p90_ms": round(p90, 3),
            "p95_ms": round(p95, 3),
            "p99_ms": round(p99, 3),
            "max_ms": round(p_max, 3),
        },
        "subsystem_profile_mean_ms": {
            "crypto_ed25519": round(float(np.mean(crypto_times)), 3),
            "z3_smt_solver": round(float(np.mean(smt_times)), 3),
            "neural_onnx_drift": round(float(np.mean(neural_times)), 3),
            "arbiter_matrix": round(float(np.mean(arbiter_times)), 3),
            "merkle_rfc6962": round(float(np.mean(merkle_times)), 3)
        },
        "category_breakdown": {
            cat: {
                "total": s["total"],
                "passed": s["correct"],
                "accuracy_pct": round((s["correct"] / s["total"]) * 100.0, 2),
                "p95_latency_ms": round(float(np.percentile(s["latencies"], 95)), 2)
            }
            for cat, s in category_stats.items()
        }
    }

    report_path = os.path.join(os.path.dirname(__file__), "benchmark_report.json")
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)

    print(f"\nSaved comprehensive benchmark report to {report_path}\n")


if __name__ == "__main__":
    main()
