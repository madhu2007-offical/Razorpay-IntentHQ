"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check, Code2, ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export default function DeveloperSnippetSection() {
  const [activeTab, setActiveTab] = useState<"curl" | "python" | "typescript">("curl");
  const [copied, setCopied] = useState(false);

  const snippets = {
    curl: `curl -X POST https://api.razorpay.com/v1/intenthq/verify \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer rzp_test_intenthq_..." \\
  -d '{
    "intent_token": "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCIsImNydiI6IkVkMjU1MTkifQ...",
    "payload": {
      "order_id": "ord_8829104",
      "merchant_id": "croma_official",
      "amount_paise": 6499900,
      "line_items": [{
        "item_id": "sku_dell_16",
        "title": "Dell Inspiron 15 (16GB RAM, 512GB SSD)",
        "quantity": 1,
        "unit_price_paise": 6499900,
        "attributes": { "specs": { "ram_gb": 16, "storage_gb": 512 } }
      }],
      "dom_context": "<div class='checkout'>Clean checkout page</div>",
      "timestamp": 1700000100,
      "nonce": "n_9921820"
    }
  }'`,
    python: `import httpx

# Inline Zero-Trust Verification (< 45ms P99 SLA)
async with httpx.AsyncClient() as client:
    response = await client.post(
        "http://localhost:8000/v1/verify",
        headers={"Content-Type": "application/json"},
        json={
            "intent_token": signed_ed25519_jwt,
            "payload": {
                "order_id": "ord_8829104",
                "merchant_id": "croma_official",
                "amount_paise": 6499900,
                "line_items": [{
                    "item_id": "sku_dell_16",
                    "title": "Dell Inspiron 15 (16GB RAM, 512GB SSD)",
                    "quantity": 1,
                    "unit_price_paise": 6499900,
                    "attributes": {"specs": {"ram_gb": 16, "storage_gb": 512}}
                }],
                "timestamp": 1700000100,
                "nonce": "n_9921820"
            }
        }
    )
    result = response.json()
    print("Verdict:", result["decision"])  # ALLOW | HOLD | BLOCK
    print("Latency:", result["total_latency_ms"], "ms")
    print("Merkle Leaf:", result["merkle_leaf_hash"])`,
    typescript: `import { verifyTransaction } from "@razorpay/intenthq";

// Execute inline verification before payment capture
const result = await verifyTransaction({
  intentToken: signedEd25519Token,
  payload: {
    orderId: "ord_8829104",
    merchantId: "croma_official",
    amountPaise: 6499900, // ₹64,999.00
    lineItems: [{
      itemId: "sku_dell_16",
      title: "Dell Inspiron 15 (16GB RAM, 512GB SSD)",
      quantity: 1,
      unitPricePaise: 6499900,
      attributes: { specs: { ram_gb: 16, storage_gb: 512 } }
    }],
    timestamp: Math.floor(Date.now() / 1000),
    nonce: "n_9921820"
  }
});

if (result.decision === "ALLOW") {
  // Dispatched to Razorpay Payment Rail
  console.log("Authorized Razorpay Order ID:", result.razorpay_order_id);
}`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 bg-[#081A3A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10275D] border border-[#1E3B82] text-xs font-mono font-bold text-[#3395FF]">
              <Terminal className="w-3.5 h-3.5 text-[#00D09C]" />
              <span>Developer-First Integration</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
              Integrate in Minutes. Verify in Microseconds.
            </h2>

            <p className="text-base text-[#CBD5E1] leading-relaxed">
              Drop IntentHQ directly into your agentic purchasing workflows or merchant checkout pipelines. A single synchronous API call guarantees that every payment is mathematically and cryptographically aligned with human intent.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-center space-x-3 text-sm text-[#CBD5E1]">
                <CheckCircle2 className="w-5 h-5 text-[#00D09C] flex-shrink-0" />
                <span>Strict P99 latency SLA strictly under 45ms (Average: 25.17ms)</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-[#CBD5E1]">
                <CheckCircle2 className="w-5 h-5 text-[#00D09C] flex-shrink-0" />
                <span>Automatic RFC 6962 append-only Merkle inclusion certificate</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-[#CBD5E1]">
                <CheckCircle2 className="w-5 h-5 text-[#00D09C] flex-shrink-0" />
                <span>Zero external LLM API dependencies in the hot decision path</span>
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <a
                href="http://localhost:8000/docs"
                target="_blank"
                rel="noreferrer"
                className="razor-btn-primary px-6 py-3 rounded-xl font-bold text-sm inline-flex items-center space-x-2"
              >
                <span>Read Full API Reference</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Code Block */}
          <div className="lg:col-span-7 bg-[#051229] border border-[#1E3B82] rounded-2xl overflow-hidden shadow-2xl">
            {/* Top Bar */}
            <div className="bg-[#0C2451] px-5 py-3 border-b border-[#1E3B82] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-[#FF3366]/80" />
                <span className="w-3 h-3 rounded-full bg-[#FFB800]/80" />
                <span className="w-3 h-3 rounded-full bg-[#00D09C]/80" />
                <span className="text-xs font-mono text-[#94A3B8] ml-2">POST /v1/verify</span>
              </div>

              {/* Language Tabs */}
              <div className="flex items-center space-x-1 bg-[#051229] p-1 rounded-lg border border-[#1E3B82]">
                <button
                  onClick={() => setActiveTab("curl")}
                  className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
                    activeTab === "curl" ? "bg-[#0A7AFF] text-white" : "text-[#94A3B8] hover:text-white"
                  }`}
                >
                  cURL
                </button>
                <button
                  onClick={() => setActiveTab("python")}
                  className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
                    activeTab === "python" ? "bg-[#0A7AFF] text-white" : "text-[#94A3B8] hover:text-white"
                  }`}
                >
                  Python
                </button>
                <button
                  onClick={() => setActiveTab("typescript")}
                  className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
                    activeTab === "typescript" ? "bg-[#0A7AFF] text-white" : "text-[#94A3B8] hover:text-white"
                  }`}
                >
                  TypeScript
                </button>
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center space-x-1 text-xs text-[#CBD5E1] hover:text-white bg-[#10275D] hover:bg-[#16347A] px-2.5 py-1 rounded border border-[#1E3B82] transition-colors font-mono"
              >
                {copied ? <Check className="w-3 h-3 text-[#00D09C]" /> : <Copy className="w-3 h-3 text-[#3395FF]" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            {/* Code Content */}
            <div className="p-6 overflow-x-auto text-xs font-mono text-[#CBD5E1] leading-relaxed max-h-[420px]">
              <pre>
                <code>{snippets[activeTab]}</code>
              </pre>
            </div>

            {/* Terminal Footer */}
            <div className="bg-[#0C2451] px-5 py-2.5 border-t border-[#1E3B82] flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
              <span className="flex items-center gap-1.5 text-[#00D09C]">
                <Zap className="w-3.5 h-3.5 text-[#00D09C]" />
                Target Response Time: &lt; 45ms P99
              </span>
              <span>Ed25519 Verified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
