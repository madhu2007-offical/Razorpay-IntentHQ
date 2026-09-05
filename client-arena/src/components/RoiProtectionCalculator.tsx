"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function RoiProtectionCalculator() {
  const [txCount, setTxCount] = useState(25000); // 25k monthly transactions
  const [avgCart, setAvgCart] = useState(12500); // ₹12,500 average purchase
  const [driftRate, setDriftRate] = useState(1.8); // 1.8% adversarial injection / drift rate

  // Financial calculations
  const monthlyGmv = txCount * avgCart;
  const monthlyPreventedLosses = monthlyGmv * (driftRate / 100);
  const annualPreventedLosses = monthlyPreventedLosses * 12;

  // Chargeback dispute fees saved (averaging ₹1,200 per dispute in merchant overhead)
  const monthlyDisputesPrevented = Math.round(txCount * (driftRate / 100));
  const annualDisputeFeesSaved = monthlyDisputesPrevented * 1200 * 12;

  // Total annual savings
  const totalAnnualValue = annualPreventedLosses + annualDisputeFeesSaved;

  // Formatter for Indian Rupees (Lakhs & Crores)
  const formatInr = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakh`;
    }
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  return (
    <section className="py-24 bg-[#FFFFFF] border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-mono font-bold text-[#0C2451] mb-3">
            <TrendingUp className="w-3.5 h-3.5 text-[#0A7AFF]" />
            <span>Enterprise Impact Calculator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0C2451] tracking-[-0.02em] font-sans">
            Calculate Drift &amp; Prompt Injection Protection
          </h2>
          <p className="text-[16px] sm:text-[17px] text-[#4A4A4A] mt-2 leading-[1.6]">
            Estimate the exact financial leakage, dispute penalties, and latency overhead eliminated by Razorpay IntentHQ across your purchasing AI agents.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Interactive Sliders */}
          <div className="lg:col-span-7 bg-[#F8F9FC] rounded-3xl p-8 sm:p-10 border border-[#E2E8F0] shadow-sm space-y-8">
            {/* Slider 1: Monthly Transactions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-[#0C2451]">
                  Monthly Autonomous Agent Transactions
                </label>
                <span className="text-base font-extrabold text-[#0A7AFF] font-mono">
                  {txCount.toLocaleString("en-IN")} txns/mo
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="250000"
                step="1000"
                value={txCount}
                onChange={(e) => setTxCount(Number(e.target.value))}
                className="w-full h-2.5 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#0A7AFF]"
              />
              <div className="flex justify-between text-[11px] text-[#94A3B8] font-mono mt-1.5">
                <span>1,000 txns</span>
                <span>100,000 txns</span>
                <span>250,000 txns</span>
              </div>
            </div>

            {/* Slider 2: Average Cart Value */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-[#0C2451]">
                  Average Transaction Value (AOV)
                </label>
                <span className="text-base font-extrabold text-[#0A7AFF] font-mono">
                  ₹{avgCart.toLocaleString("en-IN")}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="75000"
                step="500"
                value={avgCart}
                onChange={(e) => setAvgCart(Number(e.target.value))}
                className="w-full h-2.5 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#0A7AFF]"
              />
              <div className="flex justify-between text-[11px] text-[#94A3B8] font-mono mt-1.5">
                <span>₹500</span>
                <span>₹35,000</span>
                <span>₹75,000</span>
              </div>
            </div>

            {/* Slider 3: Estimated Adversarial Drift */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-[#0C2451]">
                  Estimated Adversarial Prompt &amp; Spec Drift Rate
                </label>
                <span className="text-base font-extrabold text-[#FF3366] font-mono">
                  {driftRate.toFixed(1)}% of volume
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="5.0"
                step="0.1"
                value={driftRate}
                onChange={(e) => setDriftRate(Number(e.target.value))}
                className="w-full h-2.5 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#FF3366]"
              />
              <div className="flex justify-between text-[11px] text-[#94A3B8] font-mono mt-1.5">
                <span>0.2% (Conservative)</span>
                <span>2.5% (Industry Avg)</span>
                <span>5.0% (High Exposure)</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
              <span className="font-semibold">Simulated Monthly GMV:</span>
              <span className="font-mono font-bold text-[#0C2451] text-sm">
                {formatInr(monthlyGmv)}
              </span>
            </div>
          </div>

          {/* Right Column: Dynamic Projected Impact Card */}
          <div className="lg:col-span-5 bg-[#0C2451] rounded-3xl p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between border border-[#1E3B82]">
            {/* Glow Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0A7AFF]/25 blur-[90px] rounded-full pointer-events-none -z-10" />

            <div className="space-y-6">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00D09C]">
                Projected Annual Impact
              </span>

              <div>
                <div className="text-xs text-[#CBD5E1]">Total Prevented Leakage &amp; Fees</div>
                <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-[-0.02em] font-sans mt-1">
                  {formatInr(totalAnnualValue)}
                </div>
                <div className="text-xs text-[#00D09C] font-mono mt-1">
                  ~{formatInr(monthlyPreventedLosses)} saved every month
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#1E3B82]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#CBD5E1]">Prevented Fraud Cart Swaps</span>
                  <span className="font-mono font-bold text-white">
                    {formatInr(annualPreventedLosses)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#CBD5E1]">Saved Chargeback Penalties</span>
                  <span className="font-mono font-bold text-white">
                    {formatInr(annualDisputeFeesSaved)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#CBD5E1]">Latency Speedup vs External LLMs</span>
                  <span className="font-mono font-bold text-[#00D09C]">
                    640x Faster (P99 &lt; 45ms)
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#CBD5E1]">Audit Proof Generation</span>
                  <span className="font-mono font-bold text-white">
                    100% RFC 6962 Verified
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-[#1E3B82]">
              <Link
                href="/signup"
                className="w-full razor-btn-primary py-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-[#0A7AFF]/40 group"
              >
                <span>Protect Your AI Agents Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-[11px] text-center text-[#94A3B8] mt-2.5">
                Sign up in 30 seconds with Google • Sub-45ms SLA Guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
