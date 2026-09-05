import React from "react";
import {
  Cpu,
  Zap,
  ShieldAlert,
  Key,
  GitBranch,
  CreditCard,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function FeatureCardsGrid() {
  const features = [
    {
      icon: Cpu,
      title: "Z3 Formal SMT Theorem Prover",
      desc: "Converts budgets, quantity caps, and line-item specifications into first-order logic proofs in <4ms. Zero LLM hallucinations.",
      tag: "DETERMINISTIC MATH",
      color: "text-[#0A7AFF]",
      bgColor: "bg-[#0A7AFF]/10",
    },
    {
      icon: Zap,
      title: "Local Quantized ONNX Embeddings",
      desc: "Evaluates semantic drift using sentence-transformers/all-MiniLM-L6-v2 directly in-memory without external blocking API latency.",
      tag: "P99 < 45MS",
      color: "text-[#00D09C]",
      bgColor: "bg-[#00D09C]/10",
    },
    {
      icon: ShieldAlert,
      title: "Indirect DOM Prompt Injection Firewall",
      desc: "Detects hidden review CSS injection (display:none, font-size:0), LLM delimiters, and covert cart hijacking commands.",
      tag: "ACTIVE FIREWALL",
      color: "text-[#FF3366]",
      bgColor: "bg-[#FF3366]/10",
    },
    {
      icon: Key,
      title: "Ed25519 Cryptographic Non-Repudiation",
      desc: "Intent tokens are signed with Ed25519 (RFC 8037). Guarantees caller authenticity and prevents tampering or replay attacks.",
      tag: "RFC 8037 EdDSA",
      color: "text-[#3395FF]",
      bgColor: "bg-[#3395FF]/10",
    },
    {
      icon: GitBranch,
      title: "RFC 6962 Merkle Audit Ledger",
      desc: "Every verification commits to an immutable append-only Merkle tree with SHA-256 prefixes and verifiable inclusion certificates.",
      tag: "CRYPTO AUDIT",
      color: "text-[#9B51E0]",
      bgColor: "bg-[#9B51E0]/10",
    },
    {
      icon: CreditCard,
      title: "Razorpay Dynamic Idempotency Rail",
      desc: "Generates reproducible intenthq_{jti}_{order_id} idempotency keys to guarantee seamless sandbox dispatch without double charges.",
      tag: "ZERO-DUPLICATION",
      color: "text-[#0C2451]",
      bgColor: "bg-[#0C2451]/10",
    },
  ];

  return (
    <section className="py-24 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0A7AFF] font-mono">
            Engineered For Mission-Critical Scale
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0C2451] tracking-tight mt-2 font-sans">
            Six Pillars of Zero-Trust Agentic Commerce
          </h2>
          <p className="text-base text-[#4A4A4A] mt-3">
            Designed by FinTech architects to protect merchants and autonomous purchasing agents from financial drift, injection attacks, and spec downgrades.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="razor-card-light rounded-2xl p-8 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-xl ${f.bgColor} flex items-center justify-center ${f.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">
                      {f.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0C2451] mb-2.5 font-sans group-hover:text-[#0A7AFF] transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-sm text-[#4A4A4A] leading-relaxed">
                    {f.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-semibold text-[#0A7AFF]">
                  <span>Explore Specification</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
