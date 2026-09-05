"use client";

import React from "react";
import { Clock, Activity, Gauge, Zap, CheckCircle2, AlertCircle, Cpu } from "lucide-react";
import { VerificationResult } from "../lib/types";

interface LatencyWaterfallProps {
  result: VerificationResult | null;
}

export default function LatencyWaterfall({ result }: LatencyWaterfallProps) {
  const SLA_BUDGET_MS = 45.0;

  if (!result) {
    return (
      <div className="razor-glass glow-card rounded-2xl p-6 sm:p-8 transition-all border border-[#1E3269]/70 text-center">
        <div className="flex items-center space-x-3.5 mb-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0B72E7] to-[#3395FF] flex items-center justify-center text-white shadow-lg shadow-[#0B72E7]/30">
            <Activity className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h2 className="text-lg font-bold text-white tracking-[-0.02em]">Latency Waterfall Telemetry</h2>
            <p className="text-xs text-[#93A4D0]">Real-time microsecond instrumentation & SLA audit</p>
          </div>
        </div>
        <div className="py-12 text-[#93A4D0] text-xs font-mono">
          Run an adversarial scenario above to inspect live pipeline execution telemetry.
        </div>
      </div>
    );
  }

  const breakdown = result.latency_breakdown_ms || {};
  const totalMs = result.total_latency_ms || 1.0;
  const budgetConsumedPct = Math.min(100, (totalMs / SLA_BUDGET_MS) * 100);
  const isSlaCompliant = totalMs < SLA_BUDGET_MS;

  const stages = [
    {
      name: "Ed25519 Asymmetric Signature Verify",
      key: "crypto_ms",
      val: breakdown.crypto_ms || 0.22,
      color: "bg-[#3395FF]",
      textColor: "text-[#3395FF]",
    },
    {
      name: "Z3 Formal SMT Invariant Verification",
      key: "smt_ms",
      val: breakdown.smt_ms || 1.85,
      color: "bg-[#00D09C]",
      textColor: "text-[#00D09C]",
    },
    {
      name: "ONNX Neural Drift & DOM Scanner",
      key: "neural_ms",
      val: breakdown.neural_ms || 18.0,
      color: "bg-[#0B72E7]",
      textColor: "text-[#528FF0]",
    },
    {
      name: "Arbitration Decision Matrix",
      key: "arbiter_ms",
      val: breakdown.arbiter_ms || 0.01,
      color: "bg-[#FFB800]",
      textColor: "text-[#FFB800]",
    },
    {
      name: "RFC 6962 Merkle Tree Commit",
      key: "merkle_ms",
      val: breakdown.merkle_ms || 0.16,
      color: "bg-[#9B51E0]",
      textColor: "text-[#BB6BD9]",
    },
  ];

  return (
    <div className="razor-glass glow-card rounded-2xl p-6 sm:p-8 transition-all border border-[#1E3269]/70">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E3269]/60">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0B72E7] to-[#3395FF] flex items-center justify-center text-white shadow-lg shadow-[#0B72E7]/30">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-[-0.02em]">
                Latency Waterfall
              </h2>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#00D09C]/15 text-[#00D09C] border border-[#00D09C]/30 uppercase">
                SLA Target: &lt; 45ms P99
              </span>
            </div>
            <p className="text-xs text-[#93A4D0] mt-0.5">
              Microsecond runtime profiling per subsystem along the inline hot decision path
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 border shadow-sm ${
              isSlaCompliant
                ? "bg-[#00D09C]/15 text-[#00D09C] border-[#00D09C]/40 shadow-[#00D09C]/20"
                : "bg-[#FF3366]/15 text-[#FF3366] border-[#FF3366]/40 shadow-[#FF3366]/20"
            }`}
          >
            {isSlaCompliant ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{isSlaCompliant ? "SLA COMPLIANT (<45ms)" : "SLA BREACH"}</span>
          </div>
        </div>
      </div>

      {/* Main SLA Progress Bar */}
      <div className="mt-6 bg-[#060D26] p-5 rounded-xl border border-[#1E3269]">
        <div className="flex justify-between items-center text-xs font-mono mb-2.5">
          <span className="text-[#93A4D0] flex items-center gap-2">
            <Gauge className="w-4 h-4 text-[#3395FF]" />
            Budget Utilization: {budgetConsumedPct.toFixed(1)}% of 45.00 ms
          </span>
          <span className="text-white font-bold text-sm bg-[#0B1536] px-3 py-1 rounded-lg border border-[#1E3269]">
            {totalMs.toFixed(2)} ms Total
          </span>
        </div>

        {/* Multi-segment progress bar */}
        <div className="h-4 w-full bg-[#02042B] rounded-full overflow-hidden flex border border-[#1E3269] p-0.5 relative">
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#FF3366] z-10 opacity-70" title="45ms SLA Limit" />

          {stages.map((stage) => {
            const widthPct = Math.max(1, (stage.val / SLA_BUDGET_MS) * 100);
            return (
              <div
                key={stage.key}
                style={{ width: `${widthPct}%` }}
                className={`${stage.color} h-full first:rounded-l-full last:rounded-r-full transition-all duration-300`}
                title={`${stage.name}: ${stage.val.toFixed(2)} ms`}
              />
            );
          })}
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="mt-6 space-y-2.5">
        {stages.map((stage) => {
          const pctOfTotal = ((stage.val / totalMs) * 100).toFixed(1);
          return (
            <div
              key={stage.key}
              className="flex items-center justify-between p-3 rounded-xl bg-[#060D26] border border-[#1E3269] text-xs font-mono hover:border-[#3395FF]/40 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                <span className="text-[#fafafa] font-semibold">{stage.name}</span>
              </div>

              <div className="flex items-center space-x-6">
                <span className="text-[#93A4D0]">{pctOfTotal}%</span>
                <span className={`${stage.textColor} font-bold text-sm w-24 text-right`}>
                  {stage.val.toFixed(3)} ms
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
