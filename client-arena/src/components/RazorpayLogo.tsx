import React from "react";

export default function RazorpayLogo({ className = "h-7", showBadge = true }: { className?: string; showBadge?: boolean }) {
  return (
    <div className="flex items-center space-x-2.5 select-none">
      {/* Official Razorpay angled emblem */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 filter drop-shadow-[0_2px_10px_rgba(11,114,231,0.5)]"
      >
        <path
          d="M48.8 8L20 92H38L52.5 49.5L68 49.5L59 92H77L96 8L48.8 8Z"
          fill="#0B72E7"
        />
        <path
          d="M34.5 49.5L40.5 32L61.5 32L55.5 49.5L34.5 49.5Z"
          fill="#3395FF"
        />
      </svg>

      <div className="flex items-baseline space-x-1.5">
        <span className="font-extrabold text-xl tracking-tight text-white font-sans">
          Razorpay
        </span>
        <span className="font-bold text-xl tracking-tight text-[#3395FF]">
          Intent<span className="text-[#00D09C]">HQ</span>
        </span>
      </div>

      {showBadge && (
        <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00D09C]/10 text-[#00D09C] border border-[#00D09C]/30 uppercase tracking-wide">
          Agentic Zero-Trust
        </span>
      )}
    </div>
  );
}
