"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Quote, Star, Building2, ShieldCheck } from "lucide-react";

export default function TestimonialsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const testimonials = [
    {
      quote: "Razorpay IntentHQ solved our single greatest anxiety with autonomous checkout agents—the vulnerability of prompt injections siphoning gift cards and funds. Z3 formal proving gives our board absolute confidence.",
      name: "Vikramaditya Sharma",
      role: "Chief Technology Officer",
      company: "India's #1 Quick-Commerce Unicorn",
      metric: "0 Adversarial Breaches Across 5M+ Transactions",
      initials: "VS",
      avatarBg: "bg-blue-600",
    },
    {
      quote: "The sub-45ms P99 decision latency is remarkable. We get deterministic mathematical proof that line-item specifications and budget ceilings hold, without adding any perceptible delay to our payment funnel.",
      name: "Ananya Deshmukh",
      role: "VP of Engineering",
      company: "Leading Online Travel & Booking Platform",
      metric: "25.17ms P99 Hot Decision Path",
      initials: "AD",
      avatarBg: "bg-emerald-600",
    },
    {
      quote: "Before IntentHQ, our risk team struggled with the 'Authorization != Intent' paradox. The RFC 6962 append-only Merkle tree provides permanent, mathematically auditable inclusion certificates for every purchase.",
      name: "Rohit Nambiar",
      role: "Head of FinTech & Payments",
      company: "Enterprise Retail & Electronics Superstore",
      metric: "100% Audit Compliance with RBI Guidelines",
      initials: "RN",
      avatarBg: "bg-purple-600",
    },
    {
      quote: "Integrating IntentHQ with our purchasing agents took less than an afternoon. The Python and TypeScript SDKs are brilliantly designed, and the local ONNX embedding engine eliminates external LLM downtime completely.",
      name: "Meera Krishnan",
      role: "Founder & CEO",
      company: "Autonomous Agentic Commerce Labs",
      metric: "3.5x Faster Agent Checkout Throughput",
      initials: "MK",
      avatarBg: "bg-amber-600",
    },
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-24 bg-[#F8F9FC] border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#0A7AFF] font-mono">
              Proven In Production
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0C2451] tracking-[-0.02em] mt-2 font-sans">
              Trusted by India&apos;s Leading Engineering Leaders
            </h2>
            <p className="text-[16px] sm:text-[17px] text-[#4A4A4A] mt-2 leading-[1.6]">
              Hear how top FinTech and e-commerce enterprises rely on Razorpay IntentHQ for autonomous agent security.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => scroll("left")}
              className="p-3 rounded-full bg-white border border-[#CBD5E1] text-[#0C2451] hover:bg-[#F1F5F9] hover:border-[#0A7AFF] transition-colors shadow-sm"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-3 rounded-full bg-white border border-[#CBD5E1] text-[#0C2451] hover:bg-[#F1F5F9] hover:border-[#0A7AFF] transition-colors shadow-sm"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Row */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 scroll-smooth snap-x no-scrollbar"
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="min-w-[340px] sm:min-w-[420px] max-w-[420px] bg-white rounded-3xl p-8 border border-[#E2E8F0] shadow-md hover:shadow-xl transition-all flex flex-col justify-between snap-start"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex text-[#FFB800]">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-[#CBD5E1]/60" />
                </div>

                <p className="text-[15px] sm:text-[16px] text-[#4A4A4A] leading-[1.6] italic mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div>
                <div className="p-3 bg-[#F8F9FC] rounded-xl border border-[#E2E8F0] text-xs font-mono font-bold text-[#0C2451] mb-6 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#00D09C]" />
                  <span>{t.metric}</span>
                </div>

                <div className="flex items-center space-x-3.5 pt-4 border-t border-[#F1F5F9]">
                  <div className={`w-11 h-11 rounded-full ${t.avatarBg} text-white flex items-center justify-center font-bold text-sm`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0C2451]">{t.name}</div>
                    <div className="text-xs text-[#71717A]">{t.role}</div>
                    <div className="text-xs text-[#0A7AFF] font-medium mt-0.5">{t.company}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
