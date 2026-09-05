"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight, ShieldCheck, ExternalLink, Menu, X, LogOut, Copy, Check, Key } from "lucide-react";
import { useAuth } from "../lib/AuthContext";

export default function RazorpayNavbar() {
  const { user, logout, isSandbox, toggleSandbox } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    {
      name: "Products",
      items: [
        { title: "Payment Gateway", desc: "Accept 100+ payment methods with India's #1 gateway" },
        { title: "Payment Links & Pages", desc: "Collect payments without any code or website" },
        { title: "Subscription Billing", desc: "Automate recurring payments with UPI Autopay" },
        { title: "Razorpay POS", desc: "Omnichannel in-store smart payment terminals" },
      ],
    },
    {
      name: "Intent Control Plane",
      badge: "NEW",
      items: [
        { title: "Autonomous Agent Gate", desc: "Inline Zero-Trust guardrails for purchasing AI agents" },
        { title: "Z3 SMT Invariant Prover", desc: "Deterministic mathematical budget & specification proofs" },
        { title: "DOM Prompt Injection Filter", desc: "Local ONNX scanner detecting indirect prompt injections" },
        { title: "RFC 6962 Merkle Ledger", desc: "Immutable cryptographic transaction audit certificates" },
      ],
    },
    {
      name: "Banking+",
      items: [
        { title: "Current Accounts", desc: "Standard Chartered & RBL smart digital business accounts" },
        { title: "Vendor Payouts", desc: "Automate vendor and partner payments 24x7 via IMPS/NEFT" },
        { title: "Corporate Cards", desc: "High-limit credit cards for modern digital companies" },
      ],
    },
    {
      name: "Payroll",
      items: [
        { title: "Automated Payroll", desc: "1-click salary disbursements with auto-tax deductions" },
        { title: "Compliance Suite", desc: "Automated PF, PT, ESIC, and TDS tax filings" },
      ],
    },
    {
      name: "Developers",
      items: [
        { title: "API Documentation", desc: "Interactive REST APIs, webhooks, and SDK reference" },
        { title: "Sub-45ms Telemetry", desc: "Microsecond telemetry instrumentation and SLA dashboards" },
        { title: "Red-Team Test Suite", desc: "105+ adversarial attack corpus and benchmark harness" },
      ],
    },
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-[#0C2451]/95 backdrop-blur-md shadow-lg border-b border-[#1E3B82]/60 py-3"
          : "bg-[#0C2451] border-b border-[#16347A]/50 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Official Razorpay Brand Logo */}
        <div className="flex items-center space-x-8">
          <a href="#" className="flex items-center space-x-2.5 group">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 transition-transform group-hover:scale-105"
            >
              <path d="M48.8 8L20 92H38L52.5 49.5L68 49.5L59 92H77L96 8L48.8 8Z" fill="#0A7AFF" />
              <path d="M34.5 49.5L40.5 32L61.5 32L55.5 49.5L34.5 49.5Z" fill="#3395FF" />
            </svg>
            <div className="flex items-baseline space-x-1.5">
              <span className="font-extrabold text-xl tracking-[-0.02em] text-white font-sans">
                Razorpay
              </span>
              <span className="font-bold text-xl tracking-[-0.02em] text-[#3395FF]">
                Intent<span className="text-[#00D09C]">HQ</span>
              </span>
            </div>
          </a>

          {/* Center: Desktop Nav Items with Dropdowns */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, idx) => (
              <div
                key={idx}
                className="relative"
                onMouseEnter={() => item.items && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.href ? (
                  <a
                    href={item.href}
                    className="px-3.5 py-2 text-sm font-medium text-[#CBD5E1] hover:text-white rounded-lg transition-colors inline-flex items-center gap-1.5"
                  >
                    {item.name}
                  </a>
                ) : (
                  <button
                    className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors inline-flex items-center gap-1.5 ${
                      activeDropdown === item.name
                        ? "text-white bg-[#10275D]"
                        : "text-[#CBD5E1] hover:text-white"
                    }`}
                  >
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#00D09C] text-[#0C2451]">
                        {item.badge}
                      </span>
                    )}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-150 ${
                        activeDropdown === item.name ? "rotate-180 text-[#3395FF]" : "text-[#94A3B8]"
                      }`}
                    />
                  </button>
                )}

                {/* Dropdown Menu Box */}
                {item.items && activeDropdown === item.name && (
                  <div className="absolute top-full left-0 w-80 pt-2 z-50 animate-fade-in">
                    <div className="bg-[#10275D] border border-[#1E3B82] rounded-2xl p-3 shadow-2xl space-y-1">
                      {item.items.map((sub, sIdx) => (
                        <a
                          key={sIdx}
                          href="#interactive-arena"
                          className="block p-2.5 rounded-xl hover:bg-[#16347A] transition-colors group"
                        >
                          <div className="text-sm font-semibold text-white group-hover:text-[#3395FF] transition-colors">
                            {sub.title}
                          </div>
                          <div className="text-xs text-[#94A3B8] leading-tight mt-0.5">
                            {sub.desc}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Auth CTAs */}
        <div className="hidden sm:flex items-center space-x-3">
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-[#CBD5E1] hover:text-white px-3.5 py-2 rounded-lg transition-colors font-mono"
          >
            API v1 Docs
          </a>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2.5 bg-[#10275D] border border-[#1E3B82] hover:border-[#3395FF] px-3 py-1.5 rounded-full transition-all text-left"
              >
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-[#0A7AFF]"
                />
                <div className="hidden md:block">
                  <div className="text-xs font-bold text-white max-w-[110px] truncate leading-tight">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-[#00D09C] font-mono leading-none">
                    {isSandbox ? "TEST MODE" : "LIVE"}
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-[#94A3B8] transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#10275D] border border-[#1E3B82] rounded-2xl p-4 shadow-2xl space-y-3 z-50 animate-fade-in text-white">
                  <div className="border-b border-[#1E3B82] pb-3">
                    <div className="font-bold text-sm text-white">{user.name}</div>
                    <div className="text-xs text-[#94A3B8] truncate">{user.email}</div>
                    <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00D09C]/15 text-[#00D09C] border border-[#00D09C]/30 mt-1.5">
                      {user.role}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-[11px] font-mono text-[#94A3B8] flex items-center justify-between">
                      <span>Razorpay API Key</span>
                      <button
                        onClick={() => {
                          if (user?.apiKey) {
                            navigator.clipboard.writeText(user.apiKey);
                            setCopiedKey(true);
                            setTimeout(() => setCopiedKey(false), 2000);
                          }
                        }}
                        className="text-[#3395FF] hover:underline flex items-center gap-1"
                      >
                        {copiedKey ? <Check className="w-3 h-3 text-[#00D09C]" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                    <div className="bg-[#081A3A] p-2 rounded-xl text-[11px] font-mono text-[#CBD5E1] truncate border border-[#1E3B82]">
                      {user.apiKey}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#1E3B82] flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${isSandbox ? "bg-[#FFB800] animate-pulse" : "bg-[#00D09C]"}`} />
                      <span className="text-xs font-mono">{isSandbox ? "Sandbox Mode" : "Live Production"}</span>
                    </div>
                    <button
                      onClick={toggleSandbox}
                      className="text-[11px] text-[#3395FF] hover:underline font-mono font-bold"
                    >
                      Switch
                    </button>
                  </div>

                  <div className="pt-2 border-t border-[#1E3B82]">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-[#FF3366]/15 hover:bg-[#FF3366]/25 text-[#FF3366] text-xs font-bold flex items-center justify-center space-x-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-white hover:text-[#3395FF] px-3.5 py-2 rounded-lg transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="razor-btn-primary px-4 py-2 rounded-lg text-sm font-bold flex items-center space-x-1.5 shadow-md shadow-[#0A7AFF]/30"
              >
                <span>Sign Up Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#CBD5E1] hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0C2451] border-b border-[#1E3B82] px-4 pt-3 pb-6 space-y-3">
          {user ? (
            <div className="p-3 bg-[#10275D] rounded-xl border border-[#1E3B82] flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2.5">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border border-[#0A7AFF]"
                />
                <div>
                  <div className="text-xs font-bold text-white">{user.name}</div>
                  <div className="text-[10px] text-[#94A3B8]">{user.email}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="text-xs text-[#FF3366] font-bold"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2 pb-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-1/2 py-2 rounded-lg border border-[#1E3B82] text-xs font-bold text-white text-center"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-1/2 razor-btn-primary py-2 rounded-lg text-xs font-bold text-center"
              >
                Sign Up
              </Link>
            </div>
          )}

          {navItems.map((item, i) => (
            <div key={i}>
              <div className="font-semibold text-white py-1.5 text-sm">{item.name}</div>
              {item.items && (
                <div className="pl-3 space-y-1.5 border-l border-[#1E3B82] my-1">
                  {item.items.map((sub, j) => (
                    <a
                      key={j}
                      href="#interactive-arena"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-xs text-[#94A3B8] hover:text-white py-1"
                    >
                      {sub.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="pt-3 border-t border-[#1E3B82] flex gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById("interactive-arena")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full razor-btn-primary py-2.5 rounded-lg text-xs font-bold text-center"
            >
              Launch Live Control Plane
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
