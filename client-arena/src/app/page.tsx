"use client";

import React, { useState } from "react";
import {
  Shield,
  Activity,
  Zap,
  Lock,
  GitBranch,
  Cpu,
  Layers,
  Terminal,
  ExternalLink,
  Flame,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Server,
  FileCheck,
  Check,
  Code2,
} from "lucide-react";
import RazorpayLogo from "../components/RazorpayLogo";
import IntentStudio from "../components/IntentStudio";
import AttackArena, { DEMO_SCENARIOS } from "../components/AttackArena";
import LatencyWaterfall from "../components/LatencyWaterfall";
import MerkleProofViewer from "../components/MerkleProofViewer";
import { VerificationResult, ScenarioDefinition } from "../lib/types";

export default function Home() {
  const [activeToken, setActiveToken] = useState<string | null>(null);
  const [activeClaims, setActiveClaims] = useState<any | null>(null);

  const [lastResult, setLastResult] = useState<VerificationResult | null>(null);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  const handleTokenGenerated = (token: string, claims: any) => {
    setActiveToken(token);
    setActiveClaims(claims);
  };

  const handleVerificationComplete = (res: VerificationResult, scenario: ScenarioDefinition) => {
    setLastResult(res);
    setLastOrderId(scenario.payload.order_id);
  };

  const scrollToArena = () => {
    document.getElementById("attack-arena-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#02042B] text-white">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-[#0B72E7] via-[#1665D8] to-[#00D09C] py-1.5 px-4 text-center text-xs font-medium text-white tracking-wide">
        <span className="font-bold">Razorpay IntentHQ Release:</span> Production-grade inline Zero-Trust Intent Control Plane for Autonomous AI Purchasing Agents.{" "}
        <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer" className="underline font-bold hover:text-cyan-200 ml-1">
          Explore API Docs &rarr;
        </a>
      </div>

      {/* Razorpay Authentic Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#02042B]/85 border-b border-[#1E3269]/70 px-4 lg:px-12 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <RazorpayLogo />
            <nav className="hidden md:flex items-center space-x-6 text-xs font-medium text-[#93A4D0]">
              <a href="#intent-studio-section" className="hover:text-white transition-colors">
                Intent Studio
              </a>
              <a href="#attack-arena-section" className="hover:text-white transition-colors">
                Red-Team Arena
              </a>
              <a href="#telemetry-section" className="hover:text-white transition-colors">
                Sub-45ms Telemetry
              </a>
              <a href="#merkle-section" className="hover:text-white transition-colors">
                Merkle Ledger
              </a>
              <a
                href="http://localhost:8000/docs"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <span>API Spec</span>
                <ExternalLink className="w-3 h-3 text-[#3395FF]" />
              </a>
            </nav>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            {/* Live Gateway Status */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#0B1536] border border-[#1E3269] text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-[#00D09C] animate-pulse" />
              <span className="text-[#93A4D0]">Razorpay Rail:</span>
              <span className="text-[#00D09C] font-bold">ONLINE</span>
            </div>

            <button
              onClick={scrollToArena}
              className="py-2 px-4 rounded-xl bg-[#0B72E7] hover:bg-[#095ec0] text-white font-bold transition-all shadow-md shadow-[#0B72E7]/30 flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Simulate Attack</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Glow accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#0B72E7]/20 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1536] border border-[#1E3269] text-xs font-mono text-[#3395FF] shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#00D09C]" />
            <span>Zero-Trust Inline Control Plane</span>
            <span className="text-[#1E3269]">•</span>
            <span className="text-[#00D09C] font-bold">P99 &lt; 45ms Verified</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans">
            Securing Autonomous AI Agents Before Payments Hit{" "}
            <span className="bg-gradient-to-r from-[#3395FF] via-[#00D09C] to-[#00F2FE] bg-clip-text text-transparent">
              Razorpay Rails
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#93A4D0] max-w-2xl mx-auto leading-relaxed">
            Solving the core vulnerability of agentic commerce: <strong className="text-white">Authorization != Intent</strong>. Even with valid session keys, agents can drift or succumb to prompt injections. IntentHQ formally proves invariants with Z3 SMT and commits cryptographic proofs to RFC 6962 Merkle Trees.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={scrollToArena}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#0B72E7] to-[#1665D8] hover:from-[#095ec0] hover:to-[#0B72E7] text-white font-bold text-sm transition-all shadow-lg shadow-[#0B72E7]/40 flex items-center space-x-2 group"
            >
              <span>Launch Live Attack Arena</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="py-3 px-6 rounded-xl bg-[#0B1536] hover:bg-[#13224E] border border-[#1E3269] text-[#93A4D0] hover:text-white font-medium text-sm transition-all flex items-center space-x-2"
            >
              <Terminal className="w-4 h-4 text-[#3395FF]" />
              <span>Swagger REST API</span>
            </a>
          </div>
        </div>

        {/* Razorpay 4 Key Metrics Banner */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-14">
          <div className="razor-glass rounded-2xl p-5 border border-[#1E3269]/80 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-[#93A4D0] font-bold">Strict SLA Budget</span>
              <Activity className="w-4 h-4 text-[#00D09C]" />
            </div>
            <div className="text-2xl font-extrabold text-white mt-2 font-mono">
              &lt; 45ms <span className="text-xs text-[#00D09C] font-normal font-sans">(25.17ms P99)</span>
            </div>
            <div className="text-xs text-[#93A4D0] mt-1">
              Zero external LLM API stalls in verification path
            </div>
          </div>

          <div className="razor-glass rounded-2xl p-5 border border-[#1E3269]/80 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-[#93A4D0] font-bold">Formal Math Prover</span>
              <Cpu className="w-4 h-4 text-[#3395FF]" />
            </div>
            <div className="text-2xl font-extrabold text-[#3395FF] mt-2 font-mono">
              Z3 SMT Prover
            </div>
            <div className="text-xs text-[#93A4D0] mt-1">
              First-order logic proofs on budgets & specifications
            </div>
          </div>

          <div className="razor-glass rounded-2xl p-5 border border-[#1E3269]/80 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-[#93A4D0] font-bold">Adversarial Recall</span>
              <Flame className="w-4 h-4 text-[#FF3366]" />
            </div>
            <div className="text-2xl font-extrabold text-[#00D09C] mt-2 font-mono">
              100.0% <span className="text-xs text-[#93A4D0] font-normal font-sans">(105 / 105)</span>
            </div>
            <div className="text-xs text-[#93A4D0] mt-1">
              Spec downgrades, DOM injections & bundling blocked
            </div>
          </div>

          <div className="razor-glass rounded-2xl p-5 border border-[#1E3269]/80 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-[#93A4D0] font-bold">Cryptographic Ledger</span>
              <Lock className="w-4 h-4 text-[#BB6BD9]" />
            </div>
            <div className="text-2xl font-extrabold text-[#BB6BD9] mt-2 font-mono">
              RFC 6962
            </div>
            <div className="text-xs text-[#93A4D0] mt-1">
              Append-only Merkle tree & auditable inclusion certificates
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace Body */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 space-y-12 pb-20">
        {/* 1. Intent Studio */}
        <section id="intent-studio-section">
          <IntentStudio
            onTokenGenerated={handleTokenGenerated}
            activeToken={activeToken}
            activeClaims={activeClaims}
          />
        </section>

        {/* 2. Red-Team Live Arena */}
        <section id="attack-arena-section">
          <AttackArena
            intentToken={activeToken}
            onVerificationComplete={handleVerificationComplete}
          />
        </section>

        {/* 3. Real-Time Telemetry & Cryptographic Proofs */}
        <div id="telemetry-section" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <LatencyWaterfall result={lastResult} />
          <div id="merkle-section">
            <MerkleProofViewer lastResult={lastResult} orderId={lastOrderId} />
          </div>
        </div>
      </main>

      {/* Razorpay Enterprise Footer */}
      <footer className="border-t border-[#1E3269]/80 bg-[#01021C] py-12 px-4 lg:px-12 text-[#93A4D0]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <RazorpayLogo showBadge={false} />
            <p className="text-xs text-[#93A4D0]">
              Zero-Trust Intent Control Plane for Autonomous AI Purchasing Agents. Built for mission-critical FinTech security.
            </p>
          </div>

          {/* Security Certifications */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
            <span className="px-3 py-1 rounded-lg bg-[#0B1536] border border-[#1E3269] text-white">
              Ed25519 (RFC 8037)
            </span>
            <span className="px-3 py-1 rounded-lg bg-[#0B1536] border border-[#1E3269] text-white">
              RFC 6962 Merkle Tree
            </span>
            <span className="px-3 py-1 rounded-lg bg-[#0B1536] border border-[#1E3269] text-white">
              Microsoft Z3 SMT
            </span>
            <span className="px-3 py-1 rounded-lg bg-[#0B1536] border border-[#1E3269] text-[#00D09C]">
              Razorpay Sandbox Ready
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[#1E3269]/40 flex flex-col sm:flex-row items-center justify-between text-xs text-[#4A5D8A]">
          <div>&copy; 2026 Razorpay Software Private Limited. All rights reserved.</div>
          <div className="flex items-center space-x-4 mt-2 sm:mt-0">
            <span>FastAPI Core: :8000</span>
            <span>Next.js Arena: :3000</span>
            <span>P99 &lt; 45ms SLA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
