"use client";

import React, { useState } from "react";
import {
  CreditCard,
  ShieldCheck,
  Building2,
  Users,
  Globe2,
  ArrowRight,
  CheckCircle2,
  Zap,
  Lock,
  Clock,
  Sparkles,
} from "lucide-react";

export default function ProductPillSwitcher() {
  const [activeTab, setActiveTab] = useState("intent");

  const categories = [
    { id: "intent", name: "Intent Control Plane", badge: "AI ZERO-TRUST", icon: ShieldCheck },
    { id: "payments", name: "Payment Gateway", badge: "INDIA #1", icon: CreditCard },
    { id: "banking", name: "RazorpayX Banking+", badge: "CURRENT A/C", icon: Building2 },
    { id: "payroll", name: "Automated Payroll", badge: "1-CLICK TDS", icon: Users },
    { id: "crossborder", name: "International Settlement", badge: "100+ CURRENCIES", icon: Globe2 },
  ];

  const contentMap: Record<string, any> = {
    intent: {
      title: "Inline Zero-Trust Security for Autonomous AI Purchasing Agents",
      subtitle: "The formal verification gate that ensures agentic commerce adheres mathematically and semantically to human intent before funds leave Razorpay.",
      tagline: "Authorization != Intent",
      metrics: [
        { label: "P99 Decision Latency", value: "< 45ms", sub: "25.17ms verified in-memory" },
        { label: "Formal Invariant Prover", value: "Z3 SMT", sub: "First-order logic proofs" },
        { label: "Adversarial Recall", value: "100.0%", sub: "105 / 105 attacks blocked" },
      ],
      features: [
        "Prevents indirect DOM prompt injections siphoning gift cards or funds",
        "Deterministic bounds: Budget ceilings, item quantities, and hardware specs",
        "Append-only RFC 6962 Merkle Tree with cryptographic inclusion certificates",
        "Pre-warmed local ONNX runtime embeddings with zero external LLM dependencies",
      ],
      ctaText: "Explore Red-Team Live Arena",
      ctaAction: () => {
        document.getElementById("interactive-arena")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    payments: {
      title: "Accept Payments Instantly Across 100+ Methods",
      subtitle: "Industry-highest success rates for UPI, Credit/Debit Cards, Netbanking, EMIs, and Wallets with smart dynamic routing.",
      tagline: "99.99% Core System Availability",
      metrics: [
        { label: "Supported Payment Modes", value: "100+", sub: "UPI, Cards, Netbanking" },
        { label: "Success Rate Boost", value: "+4.2%", sub: "Dynamic card network routing" },
        { label: "Instant Refunds", value: "Sub-Second", sub: "Seamless customer delight" },
      ],
      features: [
        "1-Click UPI checkout with instant intent verification",
        "Smart Dynamic Routing across 10+ bank acquiring switches",
        "PCI-DSS Level 1 compliant card tokenization and vaults",
        "Seamless drop-in SDKs for React, Next.js, iOS, and Android",
      ],
      ctaText: "Start Accepting Payments",
      ctaAction: () => {
        document.getElementById("interactive-arena")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    banking: {
      title: "Supercharged Business Banking Built for Modern Startups",
      subtitle: "Open digital current accounts, automate vendor payouts, manage corporate cards, and forecast treasury cashflow.",
      tagline: "RazorpayX Automated Finance",
      metrics: [
        { label: "Vendor Payout Speed", value: "24x7 IMPS", sub: "Instant bank settlement" },
        { label: "Corporate Credit Limit", value: "Up to ₹2 Cr", sub: "Collateral-free credit" },
        { label: "Accounting Sync", value: "Real-time", sub: "Zoho, Tally & QuickBooks" },
      ],
      features: [
        "Standard Chartered & RBL smart digital current accounts",
        "Maker-checker approvals and OTP-less automated payroll payouts",
        "Custom spend limits and virtual corporate cards for engineering teams",
        "Automated vendor invoice OCR extraction and scheduled reconciliation",
      ],
      ctaText: "Upgrade to RazorpayX",
      ctaAction: () => {
        document.getElementById("interactive-arena")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    payroll: {
      title: "India's Only 100% Automated Payroll & Tax Compliance",
      subtitle: "Execute salary disbursements in 10 minutes and automate PF, ESIC, PT, and TDS tax deductions without human error.",
      tagline: "Zero-Touch Payroll",
      metrics: [
        { label: "Salary Disbursement", value: "3 Clicks", sub: "Direct to all bank accounts" },
        { label: "Statutory Filings", value: "100% Auto", sub: "Challans generated automatically" },
        { label: "Employee Portal", value: "Self-Serve", sub: "Tax declarations & payslips" },
      ],
      features: [
        "Automatic leave and attendance sync with biometric & Slack tools",
        "Automated Form 16 generation and employee tax regime optimization",
        "Contractor and freelancer payments with automatic 194C/194J TDS deductions",
        "Group health insurance and employee wellness integration",
      ],
      ctaText: "Automate Your Payroll",
      ctaAction: () => {
        document.getElementById("interactive-arena")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    crossborder: {
      title: "Sell Globally. Settle in INR with Zero Paperwork.",
      subtitle: "Accept international payments in 100+ global currencies via cards, PayPal, and local bank transfers with instant digital FIRS.",
      tagline: "Global Export Commerce",
      metrics: [
        { label: "Supported Currencies", value: "100+", sub: "USD, EUR, GBP, SGD, AED" },
        { label: "Digital FIRS", value: "Free Instant", sub: "Automated regulatory reporting" },
        { label: "FX Conversion Fee", value: "Transparent", sub: "Lowest market exchange margins" },
      ],
      features: [
        "Accept international credit and debit cards with automated 3D Secure",
        "Instant digital Foreign Inward Remittance Statements (e-FIRS)",
        "Local banking rails in US, UK, and Europe for frictionless B2B receipts",
        "Zero setup fee, zero maintenance fee, instant online onboarding",
      ],
      ctaText: "Start Global Payments",
      ctaAction: () => {
        document.getElementById("interactive-arena")?.scrollIntoView({ behavior: "smooth" });
      },
    },
  };

  const activeContent = contentMap[activeTab];

  return (
    <section className="py-20 bg-[#F8F9FC] border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0A7AFF] font-mono">
            Modular Financial Infrastructure
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0C2451] tracking-[-0.02em] mt-2 font-sans">
            One Unified Platform for All Financial Operations
          </h2>
          <p className="text-[16px] sm:text-[17px] text-[#4A4A4A] mt-3 leading-[1.6]">
            Whether accepting payments from human buyers, autonomous AI agents, or disbursing global payouts, Razorpay provides mission-critical reliability.
          </p>
        </div>

        {/* Horizontal Tab / Pill Switcher */}
        <div className="flex items-center justify-start lg:justify-center overflow-x-auto pb-4 gap-2.5 no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeTab === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-5 py-3 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center space-x-2.5 border ${
                  isSelected
                    ? "bg-[#0C2451] text-white border-[#0C2451] shadow-lg shadow-[#0C2451]/20 scale-105"
                    : "bg-white text-[#4A4A4A] border-[#E2E8F0] hover:border-[#CBD5E1] hover:text-[#0C2451]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? "text-[#3395FF]" : "text-[#64748B]"}`} />
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isSelected
                      ? "bg-[#3395FF]/20 text-[#3395FF]"
                      : "bg-[#F1F5F9] text-[#64748B]"
                  }`}
                >
                  {cat.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mini Feature Card Container */}
        <div className="mt-8 bg-white rounded-3xl p-8 sm:p-12 border border-[#E2E8F0] shadow-xl transition-all animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-mono font-bold text-[#0C2451]">
                <Sparkles className="w-3.5 h-3.5 text-[#0A7AFF]" />
                <span>{activeContent.tagline}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0C2451] tracking-[-0.02em] font-sans">
                {activeContent.title}
              </h3>

              <p className="text-[16px] sm:text-[17px] text-[#4A4A4A] leading-[1.6]">
                {activeContent.subtitle}
              </p>

              {/* Bullet Features */}
              <div className="space-y-3 pt-2">
                {activeContent.features.map((feat: string, fIdx: number) => (
                  <div key={fIdx} className="flex items-start space-x-3 text-[15px] sm:text-[16px] text-[#4A4A4A] leading-[1.6]">
                    <CheckCircle2 className="w-5 h-5 text-[#00D09C] flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button
                  onClick={activeContent.ctaAction}
                  className="razor-btn-primary px-6 py-3 rounded-xl font-bold text-sm inline-flex items-center space-x-2 group"
                >
                  <span>{activeContent.ctaText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right KPI Metric Chips */}
            <div className="lg:col-span-5 bg-[#F8F9FC] border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-5">
              <div className="text-xs font-bold uppercase tracking-wider text-[#64748B] font-mono">
                System Telemetry &amp; SLA
              </div>

              {activeContent.metrics.map((m: any, mIdx: number) => (
                <div
                  key={mIdx}
                  className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs text-[#71717A]">{m.label}</div>
                    <div className="text-[11px] text-[#00D09C] font-mono mt-0.5">{m.sub}</div>
                  </div>
                  <div className="text-xl font-extrabold text-[#0C2451] font-mono">
                    {m.value}
                  </div>
                </div>
              ))}

              <div className="p-3 bg-[#0C2451] text-white rounded-xl text-xs font-mono flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#3395FF]">
                  <Lock className="w-3.5 h-3.5" />
                  RFC 6962 Merkle Tree
                </span>
                <span className="text-[#00D09C] font-bold">AUDITED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
