"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Cpu,
  Zap,
  GitBranch,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  Lock,
  Play,
  Pause,
  Clock,
  Sparkles,
  ChevronRight,
  Check,
} from "lucide-react";

export default function InteractiveArchitectureFlow() {
  const [activeStage, setActiveStage] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const stages = [
    {
      id: "token",
      name: "1. Intent Tokenization",
      subtitle: "Ed25519 Asymmetric Signature",
      latency: "0.22ms",
      badge: "RFC 8037 EdDSA",
      color: "from-[#0A7AFF] to-[#3395FF]",
      borderColor: "border-[#0A7AFF]",
      textColor: "text-[#3395FF]",
      icon: Lock,
      codePreview: `{
  "alg": "EdDSA",
  "sub": "user_fintech_master",
  "goal": "Dell Inspiron 16GB RAM <= ₹70,000",
  "bounds": { "hard_max_paise": 7000000 },
  "predicates": [{ "specs.ram_gb": { ">=": 16 } }]
}`,
      explanation:
        "Buyer signs intent using a high-entropy Ed25519 private key. IntentHQ verifies asymmetric non-repudiation in sub-millisecond memory without network roundtrips.",
      invariants: [
        "Cryptographic proof of human caller origin",
        "Deterministic tamper detection",
        "Replay attack prevention with nonce",
      ],
    },
    {
      id: "smt",
      name: "2. Microsoft Z3 SMT Prover",
      subtitle: "First-Order Logic Verification",
      latency: "1.85ms",
      badge: "DETERMINISTIC MATH",
      color: "from-[#00D09C] to-[#10B981]",
      borderColor: "border-[#00D09C]",
      textColor: "text-[#00D09C]",
      icon: Cpu,
      codePreview: `(declare-const ram_gb Int)
(declare-const price_paise Int)
(assert (>= ram_gb 16))
(assert (<= price_paise 7000000))
(check-sat) ; SATISFIABLE (Theorem Holds)`,
      explanation:
        "Translates line-item specs, quantity ceilings, and budget bounds into mathematical constraints. Z3 computes SAT/UNSAT proofs with 0% arithmetic hallucination risk.",
      invariants: [
        "Provable budget containment",
        "Hardware spec downgrade defense",
        "Deterministic zero-hallucination guarantee",
      ],
    },
    {
      id: "neural",
      name: "3. ONNX Neural Drift & DOM Firewall",
      subtitle: "Local Quantized Embeddings",
      latency: "22.10ms",
      badge: "P99 < 45MS",
      color: "from-[#0A7AFF] to-[#9B51E0]",
      borderColor: "border-[#3395FF]",
      textColor: "text-[#3395FF]",
      icon: Zap,
      codePreview: `cos_sim(goal_vec, item_vec) = 0.9412
injection_risk_score = 0.00
verdict = SEMANTICALLY_ALIGNED`,
      explanation:
        "Runs quantized sentence-transformers/all-MiniLM-L6-v2 directly in-memory alongside an AST regex scanner. Detects hidden DOM CSS injections and covert cart swaps.",
      invariants: [
        "Cosine similarity semantic threshold >= 0.70",
        "Zero-font & display:none injection scanning",
        "No blocking external LLM API dependencies",
      ],
    },
    {
      id: "merkle",
      name: "4. RFC 6962 Merkle Tree Ledger",
      subtitle: "Cryptographic Transparency Log",
      latency: "0.80ms",
      badge: "APPEND-ONLY LOG",
      color: "from-[#9B51E0] to-[#7928CA]",
      borderColor: "border-[#9B51E0]",
      textColor: "text-[#BB6BD9]",
      icon: GitBranch,
      codePreview: `Leaf Hash = SHA-256(0x00 || JSON(decision_record))
Root Hash = 9a2f7c...e018
Inclusion Certificate Generated`,
      explanation:
        "Every decision commits to a thread-safe, append-only Merkle tree using Certificate Transparency standard prefixes. Produces mathematically verifiable audit proofs.",
      invariants: [
        "Immutable audit trial for risk officers",
        "Downloadable RFC 6962 JSON certificates",
        "Fast inclusion proof verification",
      ],
    },
    {
      id: "rail",
      name: "5. Razorpay Sandbox Rail",
      subtitle: "Dynamic Idempotent Dispatch",
      latency: "0.20ms",
      badge: "ZERO-DUPLICATION",
      color: "from-[#0A7AFF] to-[#0C2451]",
      borderColor: "border-[#0A7AFF]",
      textColor: "text-[#0A7AFF]",
      icon: CreditCard,
      codePreview: `POST https://api.razorpay.com/v1/orders
Idempotency-Key: intenthq_jti881_ord_demo
Status: 201 Created (Authorized)`,
      explanation:
        "On ALLOW verdict, IntentHQ synthesizes a deterministic idempotency key and routes authorized transaction payloads directly to the Razorpay acquiring rail.",
      invariants: [
        "Zero duplicate charges under retries",
        "Instant settlement confirmation",
        "Seamless fallback to manual 2FA on HOLD",
      ],
    },
  ];

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % stages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [autoPlay, stages.length]);

  const current = stages[activeStage];
  const CurrentIcon = current.icon;

  return (
    <section className="py-24 bg-[#081A3A] text-white border-b border-[#1E3B82] relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-[#0A7AFF]/15 blur-[160px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#10275D] border border-[#1E3B82] text-xs font-mono font-bold text-[#3395FF] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#00D09C]" />
              <span>Interactive Pipeline Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-[-0.02em] font-sans">
              The Sub-45ms Zero-Trust Execution Highway
            </h2>
            <p className="text-[16px] sm:text-[17px] text-[#CBD5E1] mt-2 max-w-2xl leading-[1.6]">
              Walk through the exact in-memory verification path that protects merchants and agents before funds leave Razorpay.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className="px-4 py-2 rounded-xl bg-[#10275D] border border-[#1E3B82] hover:border-[#3395FF] text-xs font-mono text-[#CBD5E1] hover:text-white flex items-center space-x-2 transition-colors"
            >
              {autoPlay ? <Pause className="w-3.5 h-3.5 text-[#00D09C]" /> : <Play className="w-3.5 h-3.5 text-[#3395FF]" />}
              <span>{autoPlay ? "Pause Auto-Tour" : "Resume Tour"}</span>
            </button>
          </div>
        </div>

        {/* 5-Step Pipeline Progress Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
          {stages.map((stg, idx) => {
            const isSelected = activeStage === idx;
            const Icon = stg.icon;

            return (
              <button
                key={stg.id}
                onClick={() => {
                  setAutoPlay(false);
                  setActiveStage(idx);
                }}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#10275D] border-[#0A7AFF] shadow-lg shadow-[#0A7AFF]/25 scale-[1.02]"
                    : "bg-[#0C2451]/60 border-[#1E3B82] hover:border-[#3395FF]/60 hover:bg-[#10275D]/40"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected ? "bg-[#0A7AFF] text-white" : "bg-[#16347A] text-[#94A3B8]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-[#00D09C] font-bold">
                      {stg.latency}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white font-sans truncate">{stg.name}</div>
                </div>

                {isSelected && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0A7AFF] to-[#00D09C]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Stage Detailed Inspector */}
        <div className="bg-[#051229] border border-[#1E3B82] rounded-3xl p-6 sm:p-10 shadow-2xl animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Detail */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-[#10275D] border border-[#1E3B82] flex items-center justify-center text-[#3395FF]">
                  <CurrentIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#10275D] text-[#3395FF] border border-[#1E3B82]">
                    {current.badge}
                  </span>
                  <h3 className="text-2xl font-extrabold text-white tracking-[-0.02em] font-sans mt-1">
                    {current.name}
                  </h3>
                </div>
              </div>

              <p className="text-[16px] text-[#CBD5E1] leading-[1.6]">
                {current.explanation}
              </p>

              {/* Guarantees List */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#94A3B8]">
                  Enforced Guarantees
                </div>
                {current.invariants.map((inv, iIdx) => (
                  <div key={iIdx} className="flex items-center space-x-3 text-sm text-[#CBD5E1]">
                    <CheckCircle2 className="w-4 h-4 text-[#00D09C] flex-shrink-0" />
                    <span>{inv}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center space-x-4">
                <div className="p-3 bg-[#0C2451] rounded-xl border border-[#1E3B82] flex items-center space-x-2.5">
                  <Clock className="w-4 h-4 text-[#00D09C]" />
                  <span className="text-xs font-mono text-[#CBD5E1]">
                    Stage Latency: <strong className="text-white">{current.latency}</strong>
                  </span>
                </div>
                <div className="p-3 bg-[#0C2451] rounded-xl border border-[#1E3B82] flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-[#3395FF]" />
                  <span className="text-xs font-mono text-[#CBD5E1]">
                    SLA Compliance: <strong className="text-[#00D09C]">100%</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Right Interactive Code / Telemetry Payload */}
            <div className="lg:col-span-6 bg-[#081A3A] rounded-2xl border border-[#1E3B82] overflow-hidden shadow-xl">
              <div className="bg-[#0C2451] px-5 py-3 border-b border-[#1E3B82] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF3366]/80" />
                  <span className="w-3 h-3 rounded-full bg-[#FFB800]/80" />
                  <span className="w-3 h-3 rounded-full bg-[#00D09C]/80" />
                  <span className="text-xs font-mono text-[#94A3B8] ml-2">
                    Runtime Inspection: {current.id}.ast
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#00D09C] font-bold">
                  VERIFIED IN-MEMORY
                </span>
              </div>

              <div className="p-6">
                <pre className="text-xs sm:text-sm font-mono text-[#CBD5E1] overflow-x-auto leading-relaxed">
                  <code>{current.codePreview}</code>
                </pre>
              </div>

              <div className="p-4 bg-[#051229] border-t border-[#1E3B82] flex items-center justify-between text-xs font-mono text-[#94A3B8]">
                <span>Pipeline Stage {activeStage + 1} of 5</span>
                <button
                  onClick={() => setActiveStage((activeStage + 1) % stages.length)}
                  className="text-[#3395FF] hover:text-white flex items-center space-x-1 font-bold"
                >
                  <span>Next Pipeline Stage</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
