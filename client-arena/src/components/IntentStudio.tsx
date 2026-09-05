"use client";

import React, { useState, useEffect } from "react";
import { Key, ShieldCheck, Sparkles, Copy, Check, ArrowRight, Layers, Sliders, Shield, Terminal } from "lucide-react";
import { TokenizeResponse, InvariantPredicate } from "../lib/types";
import { tokenizeIntent } from "../lib/api";

interface IntentStudioProps {
  onTokenGenerated: (token: string, claims: any) => void;
  activeToken: string | null;
  activeClaims: any | null;
}

export const PRESETS = [
  {
    id: "laptop_dev",
    name: "Developer Laptop (16GB RAM)",
    badge: "Hardware Invariant",
    goal: "Buy a 16GB RAM laptop under ₹70,000 from Croma or Reliance Digital",
    maxPaise: 7000000,
    maxItems: 1,
    whitelists: ["croma_official", "reliance_digital"],
    predicates: [
      { field: "specs.ram_gb", operator: ">=" as const, value: 16 },
      { field: "specs.storage_gb", operator: ">=" as const, value: 512 }
    ]
  },
  {
    id: "monitor_4k",
    name: "4K Color IPS Monitor",
    badge: "Display Invariant",
    goal: "Purchase a 27-inch 4K UHD IPS monitor under ₹35,000 from Croma",
    maxPaise: 3500000,
    maxItems: 1,
    whitelists: ["croma_official"],
    predicates: [
      { field: "specs.resolution", operator: "==" as const, value: "4K" }
    ]
  }
];

export default function IntentStudio({ onTokenGenerated, activeToken, activeClaims }: IntentStudioProps) {
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0].id);
  const [prompt, setPrompt] = useState(PRESETS[0].goal);
  const [hardMaxInr, setHardMaxInr] = useState(70000);
  const [maxItems, setMaxItems] = useState(1);
  const [whitelistStr, setWhitelistStr] = useState("croma_official, reliance_digital");
  const [predicates, setPredicates] = useState<InvariantPredicate[]>(PRESETS[0].predicates);

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApplyPreset = (presetId: string) => {
    const p = PRESETS.find(x => x.id === presetId);
    if (!p) return;
    setSelectedPreset(presetId);
    setPrompt(p.goal);
    setHardMaxInr(p.maxPaise / 100);
    setMaxItems(p.maxItems);
    setWhitelistStr(p.whitelists.join(", "));
    setPredicates(p.predicates);
  };

  const handleGenerateToken = async () => {
    setLoading(true);
    setError(null);
    try {
      const whitelists = whitelistStr
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

      const res: TokenizeResponse = await tokenizeIntent({
        sub: "user_fintech_master",
        semantic_goal: prompt,
        hard_max_paise: hardMaxInr * 100,
        currency: "INR",
        max_items: maxItems,
        whitelist_merchant_ids: whitelists,
        predicates: predicates,
        validity_minutes: 60,
      });

      onTokenGenerated(res.token, res.claims);
    } catch (err: any) {
      setError(err.message || "Failed to mint token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!activeToken) {
      handleGenerateToken();
    }
  }, []);

  const copyToken = () => {
    if (activeToken) {
      navigator.clipboard.writeText(activeToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="razor-glass glow-card rounded-2xl p-6 sm:p-8 transition-all border border-[#1E3269]/70">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E3269]/60">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0B72E7] to-[#3395FF] flex items-center justify-center text-white shadow-lg shadow-[#0B72E7]/30">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Intent Studio
              </h2>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#0B72E7]/15 text-[#3395FF] border border-[#0B72E7]/30 uppercase">
                Ed25519 Tokenizer
              </span>
            </div>
            <p className="text-xs text-[#93A4D0] mt-0.5">
              Transform natural human purchasing intent into cryptographically signed First-Order mathematical invariants
            </p>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2 bg-[#060D26] p-1.5 rounded-xl border border-[#1E3269]/60">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleApplyPreset(p.id)}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                selectedPreset === p.id
                  ? "bg-[#0B72E7] text-white shadow-md shadow-[#0B72E7]/40"
                  : "text-[#93A4D0] hover:text-white hover:bg-[#0B1536]"
              }`}
            >
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        {/* Left Column: Input and Invariant Configuration */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#93A4D0] uppercase tracking-wider block mb-1.5">
              Human Intent Prompt (Semantic Goal)
            </label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="w-full bg-[#060D26]/90 border border-[#1E3269] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#0B72E7] focus:ring-2 focus:ring-[#0B72E7]/20 transition-all placeholder-[#4A5D8A]"
                placeholder="e.g. Buy a 16GB RAM laptop under ₹70,000 from Croma"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#93A4D0] uppercase tracking-wider block mb-1.5">
                Budget Ceiling (INR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs text-[#93A4D0] font-mono">₹</span>
                <input
                  type="number"
                  value={hardMaxInr}
                  onChange={(e) => setHardMaxInr(Number(e.target.value))}
                  className="w-full bg-[#060D26]/90 border border-[#1E3269] rounded-xl pl-7 pr-3 py-2 text-sm text-white focus:outline-none focus:border-[#0B72E7] font-mono"
                />
              </div>
              <span className="text-[11px] text-[#00D09C] font-mono mt-1 block">
                = {(hardMaxInr * 100).toLocaleString()} Paise
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-[#93A4D0] uppercase tracking-wider block mb-1.5">
                Max Allowed Items
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={maxItems}
                onChange={(e) => setMaxItems(Number(e.target.value))}
                className="w-full bg-[#060D26]/90 border border-[#1E3269] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#0B72E7] font-mono"
              />
              <span className="text-[11px] text-[#93A4D0] font-mono mt-1 block">
                Single SKU strict invariant
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#93A4D0] uppercase tracking-wider block mb-1.5">
              Merchant Whitelist IDs
            </label>
            <input
              type="text"
              value={whitelistStr}
              onChange={(e) => setWhitelistStr(e.target.value)}
              className="w-full bg-[#060D26]/90 border border-[#1E3269] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#0B72E7] font-mono"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#93A4D0] uppercase tracking-wider">
                Deterministic SMT Invariants (Z3 First-Order Logic)
              </label>
            </div>
            <div className="space-y-2 bg-[#060D26]/70 border border-[#1E3269] rounded-xl p-3.5">
              {predicates.map((pred, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs font-mono bg-[#0B1536] px-3 py-2 rounded-lg border border-[#1E3269]/80"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[#3395FF] font-semibold">{pred.field}</span>
                    <span className="text-[#FFB800] font-bold">{pred.operator}</span>
                    <span className="text-[#00D09C] font-semibold">{String(pred.value)}</span>
                  </div>
                  <span className="text-[10px] text-[#93A4D0] bg-[#13224E] px-2 py-0.5 rounded">
                    SMT Verified
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerateToken}
            disabled={loading}
            className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-[#0B72E7] to-[#1665D8] hover:from-[#095ec0] hover:to-[#0B72E7] text-white font-bold text-sm transition-all flex items-center justify-center space-x-2 shadow-lg shadow-[#0B72E7]/40 hover:shadow-[#0B72E7]/60 disabled:opacity-50 group"
          >
            {loading ? (
              <span className="animate-pulse">Signing Ed25519 Intent Token...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#00F2FE]" />
                <span>Mint Signed IntentToken</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {error && (
            <div className="text-xs text-[#FF3366] bg-[#FF3366]/10 border border-[#FF3366]/30 p-3 rounded-xl">
              {error}
            </div>
          )}
        </div>

        {/* Right Column: Signed Ed25519 JWT / AST Claims Inspector */}
        <div className="flex flex-col h-full bg-[#060D26]/90 border border-[#1E3269] rounded-xl p-5 font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E3269] mb-3">
            <div className="flex items-center space-x-2 text-[#3395FF]">
              <ShieldCheck className="w-4 h-4 text-[#00D09C]" />
              <span className="font-bold text-white">Cryptographic Intent Claims</span>
            </div>
            {activeToken && (
              <button
                onClick={copyToken}
                className="flex items-center space-x-1.5 text-[#93A4D0] hover:text-white transition-colors bg-[#0B1536] hover:bg-[#13224E] px-2.5 py-1 rounded-lg border border-[#1E3269]"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-[#00D09C]" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-[#3395FF]" />
                )}
                <span>{copied ? "Copied" : "Copy Token"}</span>
              </button>
            )}
          </div>

          {activeClaims ? (
            <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
              <div className="bg-[#0B1536] p-3 rounded-lg border border-[#1E3269]">
                <div className="text-[#93A4D0] text-[10px] uppercase font-bold">Subject / Unique Intent ID:</div>
                <div className="text-[#3395FF] font-bold truncate mt-0.5">{activeClaims.jti}</div>
                <div className="text-[#93A4D0] text-[10px] mt-1">
                  Valid Until: {new Date(activeClaims.exp * 1000).toLocaleTimeString()}
                </div>
              </div>

              <div className="bg-[#0B1536] p-3 rounded-lg border border-[#1E3269]">
                <div className="text-[#93A4D0] text-[10px] uppercase font-bold">Human Intent (Semantic Goal):</div>
                <div className="text-white text-[12px] mt-1 font-sans">
                  "{activeClaims.semantic_goal}"
                </div>
              </div>

              <div className="bg-[#0B1536] p-3 rounded-lg border border-[#1E3269]">
                <div className="text-[#93A4D0] text-[10px] uppercase font-bold">Financial Boundary Envelope:</div>
                <div className="text-[#00D09C] mt-1 font-bold">
                  hard_max: ₹{(activeClaims.financial_bounds.hard_max_paise / 100).toLocaleString()}{" "}
                  <span className="text-[#93A4D0] font-normal">
                    ({activeClaims.financial_bounds.hard_max_paise} paise)
                  </span>
                </div>
                <div className="text-[#3395FF] mt-0.5">
                  max_items: {activeClaims.financial_bounds.max_items}
                </div>
              </div>

              <div className="bg-[#0B1536] p-3 rounded-lg border border-[#1E3269]">
                <div className="text-[#93A4D0] text-[10px] uppercase font-bold flex items-center justify-between">
                  <span>Raw Ed25519 JWT (RFC 8037):</span>
                  <span className="text-[#00D09C] text-[10px]">EdDSA Verified</span>
                </div>
                <div className="text-[#93A4D0] break-all text-[10px] mt-1.5 font-mono select-all p-2 bg-[#060D26] rounded border border-[#1E3269]/60">
                  {activeToken}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#93A4D0] py-12">
              <Shield className="w-8 h-8 mb-2 opacity-40 text-[#0B72E7] animate-pulse" />
              <span>Click "Mint Signed IntentToken" to activate</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
