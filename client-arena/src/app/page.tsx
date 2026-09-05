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
  Check,
  CreditCard,
  Building2,
  Users,
  Globe2,
} from "lucide-react";
import RazorpayNavbar from "../components/RazorpayNavbar";
import TrustLogoStrip from "../components/TrustLogoStrip";
import ProductPillSwitcher from "../components/ProductPillSwitcher";
import FeatureCardsGrid from "../components/FeatureCardsGrid";
import DeveloperSnippetSection from "../components/DeveloperSnippetSection";
import TestimonialsCarousel from "../components/TestimonialsCarousel";
import FaqAccordionSection from "../components/FaqAccordionSection";
import RazorpayFooter from "../components/RazorpayFooter";

import IntentStudio from "../components/IntentStudio";
import AttackArena from "../components/AttackArena";
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
    document.getElementById("interactive-arena")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A]">
      {/* 1. Sticky Top Navigation Bar */}
      <RazorpayNavbar />

      {/* 2. Full-Width Dark Navy Hero Section (#0C2451) */}
      <section className="bg-[#0C2451] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[380px] bg-[#0A7AFF]/25 blur-[140px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10275D] border border-[#1E3B82] text-xs font-mono font-bold text-[#3395FF] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#00D09C] animate-pulse" />
              <span>Razorpay IntentHQ Zero-Trust Control Plane</span>
              <span className="text-[#1E3B82]">•</span>
              <span className="text-white">P99 &lt; 45ms</span>
            </div>

            {/* Benefit-Driven Large Headline (48-64px) */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-[-0.02em] text-white leading-tight font-sans">
              Sell in India. <br />
              <span className="text-[#3395FF]">Verify Every Intent.</span> Settle Globally.
            </h1>

            {/* Medium-weight body text (16-18px, line-height 1.6) */}
            <p className="text-[16px] sm:text-[18px] font-normal sm:font-medium text-[#CBD5E1] max-w-2xl mx-auto leading-[1.6]">
              When autonomous purchasing AI agents execute payments on your gateway, <strong className="text-white font-semibold">Authorization != Intent</strong>. IntentHQ inline verifies transactions with Microsoft Z3 formal theorem proving and quantized ONNX embeddings before funds leave Razorpay.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={scrollToArena}
                className="razor-btn-primary px-8 py-4 rounded-xl text-base font-bold inline-flex items-center space-x-2 shadow-lg shadow-[#0A7AFF]/40 group"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#interactive-arena"
                className="razor-btn-outline px-7 py-4 rounded-xl text-base font-semibold inline-flex items-center space-x-2"
              >
                <Zap className="w-4 h-4 text-[#00D09C]" />
                <span>Simulate 4 Attack Scenarios</span>
              </a>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#94A3B8] font-mono">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#00D09C]" />
                Z3 SMT Prover (<span className="text-white">1.85ms</span>)
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#00D09C]" />
                100% Adversarial Recall (<span className="text-white">105/105</span>)
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#00D09C]" />
                RFC 6962 Merkle Ledger
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#00D09C]" />
                Ed25519 Signed (RFC 8037)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Trust / Partner Logo Strip (Clean White) */}
      <TrustLogoStrip />

      {/* 4. Horizontal Tab / Pill Switcher (Light Gray #F8F9FC) */}
      <ProductPillSwitcher />

      {/* 5. Grid of Feature / Product Cards (Clean White #FFFFFF) */}
      <FeatureCardsGrid />

      {/* 6. Live Interactive Control Plane & Red-Team Arena (Dark Navy Contrast Section) */}
      <section id="interactive-arena" className="py-24 bg-[#0C2451] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#3395FF] font-mono">
              Live Inline Control Plane
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-[-0.02em] font-sans">
              Interactive Red-Team Arena &amp; Telemetry
            </h2>
            <p className="text-[16px] sm:text-[17px] text-[#CBD5E1] leading-[1.6]">
              Simulate real-time purchasing AI agent payloads against the inline Zero-Trust control plane. Experience formal Z3 mathematical invariant proofs, quantized ONNX semantic drift detection, and RFC 6962 Merkle tree commits.
            </p>
          </div>

          {/* Module 1: Intent Studio */}
          <div>
            <IntentStudio
              onTokenGenerated={handleTokenGenerated}
              activeToken={activeToken}
              activeClaims={activeClaims}
            />
          </div>

          {/* Module 2: Attack Arena (4 Pre-configured Scenarios) */}
          <div>
            <AttackArena
              intentToken={activeToken}
              onVerificationComplete={handleVerificationComplete}
            />
          </div>

          {/* Module 3: Microsecond Telemetry Waterfall & Merkle Proof Drawer */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <LatencyWaterfall result={lastResult} />
            <MerkleProofViewer lastResult={lastResult} orderId={lastOrderId} />
          </div>
        </div>
      </section>

      {/* 7. Developer-Focused Code Snippet Section (Dark Navy #081A3A) */}
      <DeveloperSnippetSection />

      {/* 8. Testimonials Horizontal Scrolling Carousel (Light Gray #F8F9FC) */}
      <TestimonialsCarousel />

      {/* 9. FAQ Accordion Section (Clean White #FFFFFF) */}
      <FaqAccordionSection />

      {/* 10. Full-Width CTA Banner (Dark Navy Contrast #0C2451) */}
      <section className="py-20 bg-[#0C2451] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-[#0A7AFF]/20 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#00D09C] font-mono">
            Get Started In Minutes
          </span>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-[-0.02em] font-sans">
            Ready to Protect Autonomous Agent Payments?
          </h2>

          <p className="text-[16px] sm:text-[18px] text-[#CBD5E1] max-w-2xl mx-auto leading-[1.6] font-normal sm:font-medium">
            Join thousands of enterprises securing agentic commerce with Razorpay IntentHQ. Sub-45ms latency, formal SMT mathematical guarantees, and seamless sandbox dispatch.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={scrollToArena}
              className="razor-btn-primary px-8 py-4 rounded-xl text-base font-bold inline-flex items-center space-x-2 shadow-xl shadow-[#0A7AFF]/40 group"
            >
              <span>Launch Live Simulation</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="razor-btn-outline px-8 py-4 rounded-xl text-base font-semibold inline-flex items-center space-x-2"
            >
              <Terminal className="w-4 h-4 text-[#3395FF]" />
              <span>Explore Swagger REST API</span>
            </a>
          </div>
        </div>
      </section>

      {/* 11. Multi-Column Dark Navy Footer */}
      <RazorpayFooter />
    </div>
  );
}
