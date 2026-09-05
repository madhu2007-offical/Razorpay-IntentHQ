import React from "react";

export default function TrustLogoStrip() {
  const logos = [
    { name: "Swiggy", label: "SWIGGY" },
    { name: "Zomato", label: "zomato" },
    { name: "Flipkart", label: "Flipkart" },
    { name: "Nykaa", label: "NYKAA" },
    { name: "Zerodha", label: "ZERODHA" },
    { name: "CRED", label: "CRED" },
    { name: "BookMyShow", label: "bookmyshow" },
    { name: "MakeMyTrip", label: "make my trip" },
  ];

  return (
    <div className="bg-[#FFFFFF] border-b border-[#E2E8F0] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-[#71717A] mb-8">
          Powering transactions for 150,000+ businesses &amp; 70% of India&apos;s unicorns
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-8 items-center justify-items-center opacity-70">
          {logos.map((logo, idx) => (
            <div
              key={idx}
              className="text-sm font-black tracking-tighter text-[#64748B] hover:text-[#0C2451] transition-colors cursor-default select-none uppercase font-sans"
            >
              {logo.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
