import React from "react";
import { ShieldCheck, Lock, ExternalLink, Github, Twitter, Linkedin, Youtube } from "lucide-react";

export default function RazorpayFooter() {
  const footerSections = [
    {
      title: "ACCEPT PAYMENTS",
      links: [
        { label: "Payment Gateway", href: "#" },
        { label: "Payment Links & Pages", href: "#" },
        { label: "Subscription Billing", href: "#" },
        { label: "Smart Dynamic Routing", href: "#" },
        { label: "Instant Refunds", href: "#" },
      ],
    },
    {
      title: "INTENT CONTROL PLANE",
      links: [
        { label: "Inline Zero-Trust Gate", href: "#interactive-arena" },
        { label: "Z3 SMT Invariant Prover", href: "#interactive-arena" },
        { label: "DOM Injection Firewall", href: "#interactive-arena" },
        { label: "RFC 6962 Merkle Ledger", href: "#interactive-arena" },
        { label: "105+ Attack Corpus", href: "#interactive-arena" },
      ],
    },
    {
      title: "RAZORPAYX BANKING+",
      links: [
        { label: "Business Current Accounts", href: "#" },
        { label: "Automated Vendor Payouts", href: "#" },
        { label: "Corporate Credit Cards", href: "#" },
        { label: "Automated Payroll Suite", href: "#" },
        { label: "Tax & TDS Compliance", href: "#" },
      ],
    },
    {
      title: "DEVELOPERS",
      links: [
        { label: "API Documentation", href: "http://localhost:8000/docs" },
        { label: "Swagger OpenAPI Explorer", href: "http://localhost:8000/docs" },
        { label: "Sub-45ms Telemetry", href: "#interactive-arena" },
        { label: "Python 3.12 SDK", href: "#" },
        { label: "Next.js 15 Starter Kit", href: "#" },
      ],
    },
    {
      title: "COMPANY & SECURITY",
      links: [
        { label: "About Razorpay", href: "https://razorpay.com" },
        { label: "Security & Trust Center", href: "#" },
        { label: "PCI-DSS Level 1 Compliance", href: "#" },
        { label: "ISO 27001 Certified", href: "#" },
        { label: "Privacy & Terms", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-[#081A3A] border-t border-[#1E3B82] text-white pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Brand & Summary */}
        <div className="pb-12 border-b border-[#1E3B82]/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-9 h-9"
            >
              <path d="M48.8 8L20 92H38L52.5 49.5L68 49.5L59 92H77L96 8L48.8 8Z" fill="#0A7AFF" />
              <path d="M34.5 49.5L40.5 32L61.5 32L55.5 49.5L34.5 49.5Z" fill="#3395FF" />
            </svg>
            <div>
              <div className="text-xl font-extrabold tracking-[-0.02em]">
                Razorpay <span className="text-[#3395FF]">Intent<span className="text-[#00D09C]">HQ</span></span>
              </div>
              <p className="text-xs text-[#94A3B8]">
                Inline Zero-Trust Intent-to-Transaction Control Plane for Agentic Commerce
              </p>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center space-x-3 text-[#94A3B8]">
            <a
              href="https://github.com/madhu2007-offical/Razorpay-IntentHQ"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-full bg-[#10275D] hover:text-white hover:bg-[#16347A] transition-colors"
              aria-label="GitHub Repository"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com/razorpay"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-full bg-[#10275D] hover:text-white hover:bg-[#16347A] transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com/company/razorpay"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-full bg-[#10275D] hover:text-white hover:bg-[#16347A] transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://youtube.com/@Razorpayindia"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-full bg-[#10275D] hover:text-white hover:bg-[#16347A] transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 py-12 border-b border-[#1E3B82]/70">
          {footerSections.map((sec, idx) => (
            <div key={idx} className="space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#94A3B8]">
                {sec.title}
              </h4>
              <ul className="space-y-2.5 text-xs text-[#CBD5E1]">
                {sec.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <a
                      href={link.href}
                      className="hover:text-[#3395FF] transition-colors leading-relaxed block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Compliance & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-[#051229] border border-[#1E3B82] text-[#CBD5E1] font-mono">
              PCI-DSS Level 1
            </span>
            <span className="px-2.5 py-1 rounded bg-[#051229] border border-[#1E3269] text-[#CBD5E1] font-mono">
              RFC 6962 Standard
            </span>
            <span className="px-2.5 py-1 rounded bg-[#051229] border border-[#1E3269] text-[#CBD5E1] font-mono">
              Ed25519 Verified
            </span>
            <span className="px-2.5 py-1 rounded bg-[#051229] border border-[#1E3269] text-[#00D09C] font-mono">
              25.17ms P99 Latency
            </span>
          </div>

          <div className="text-center md:text-right">
            &copy; 2026 Razorpay Software Private Limited. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
