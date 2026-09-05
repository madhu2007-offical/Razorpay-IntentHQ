"use client";

import React, { useState } from "react";
import { X, User, Plus, ArrowRight, ShieldCheck, Check } from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { useRouter } from "next/navigation";

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRECONFIGURED_ACCOUNTS = [
  {
    name: "Madhu S.",
    email: "madhu.fintech@gmail.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    badge: "Personal Account",
  },
  {
    name: "Razorpay Autonomous Lab",
    email: "agent.dev@razorpay.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    badge: "Enterprise Workspace",
  },
  {
    name: "Agentic Commerce Engineering",
    email: "arch@agentic-commerce.io",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
    badge: "Developer Sandbox",
  },
];

export default function GoogleAuthModal({ isOpen, onClose }: GoogleAuthModalProps) {
  const { loginWithGoogle } = useAuth();
  const router = useRouter();

  const [customMode, setCustomMode] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [signingInAccount, setSigningInAccount] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectAccount = async (acc: { name: string; email: string; avatar?: string }) => {
    setSigningInAccount(acc.email);
    setTimeout(async () => {
      await loginWithGoogle(acc);
      onClose();
      router.push("/#interactive-arena");
    }, 700);
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    const name = customName.trim() || customEmail.split("@")[0];
    setSigningInAccount(customEmail);
    setTimeout(async () => {
      await loginWithGoogle({ name, email: customEmail });
      onClose();
      router.push("/#interactive-arena");
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[#E2E8F0] relative">
        {/* Top Header */}
        <div className="p-6 border-b border-[#F1F5F9] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Google Colorful G SVG */}
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <div>
              <h3 className="text-base font-bold text-[#1A1A1A] font-sans">
                Sign in with Google
              </h3>
              <p className="text-xs text-[#64748B]">to continue to Razorpay IntentHQ</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#64748B] hover:text-[#1A1A1A] hover:bg-[#F1F5F9] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Account Selection Body */}
        <div className="p-6 space-y-4">
          {!customMode ? (
            <>
              <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                Choose an account
              </div>

              <div className="space-y-2">
                {PRECONFIGURED_ACCOUNTS.map((acc, idx) => {
                  const isSigning = signingInAccount === acc.email;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectAccount(acc)}
                      disabled={Boolean(signingInAccount)}
                      className={`w-full p-3.5 rounded-2xl border transition-all flex items-center justify-between text-left group ${
                        isSigning
                          ? "bg-[#0A7AFF]/10 border-[#0A7AFF]"
                          : "border-[#E2E8F0] hover:border-[#0A7AFF] hover:bg-[#F8F9FC]"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          className="w-10 h-10 rounded-full object-cover border border-[#E2E8F0]"
                        />
                        <div>
                          <div className="text-sm font-bold text-[#0C2451] group-hover:text-[#0A7AFF] transition-colors">
                            {acc.name}
                          </div>
                          <div className="text-xs text-[#64748B]">{acc.email}</div>
                        </div>
                      </div>

                      {isSigning ? (
                        <div className="w-5 h-5 border-2 border-[#0A7AFF] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B]">
                          {acc.badge}
                        </span>
                      )}
                    </button>
                  );
                })}

                {/* Use Another Account Button */}
                <button
                  onClick={() => setCustomMode(true)}
                  className="w-full p-3.5 rounded-2xl border border-dashed border-[#CBD5E1] hover:border-[#0A7AFF] hover:bg-[#F8F9FC] transition-all flex items-center space-x-3 text-left group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#64748B] group-hover:text-[#0A7AFF] group-hover:bg-[#0A7AFF]/10 transition-colors">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0C2451] group-hover:text-[#0A7AFF] transition-colors">
                      Use another Google account
                    </div>
                    <div className="text-xs text-[#64748B]">Sign in with any Gmail or Workspace address</div>
                  </div>
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Enter Account Details
                </span>
                <button
                  type="button"
                  onClick={() => setCustomMode(false)}
                  className="text-xs text-[#0A7AFF] font-semibold hover:underline"
                >
                  Back to suggested
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-[#4A4A4A] block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Madhusudhanan S"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0C2451] focus:outline-none focus:border-[#0A7AFF] focus:ring-2 focus:ring-[#0A7AFF]/20 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#4A4A4A] block mb-1">
                  Email or Phone
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0C2451] focus:outline-none focus:border-[#0A7AFF] focus:ring-2 focus:ring-[#0A7AFF]/20 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={Boolean(signingInAccount)}
                className="w-full razor-btn-primary py-3 rounded-xl text-sm font-bold flex items-center justify-center space-x-2"
              >
                {signingInAccount ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Privacy & Permissions Notice */}
          <div className="pt-2 text-[11px] text-[#64748B] leading-relaxed border-t border-[#F1F5F9] flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#00D09C] flex-shrink-0 mt-0.5" />
            <span>
              To continue, Google will share your name, email address, language preference, and profile picture with Razorpay IntentHQ. See Razorpay&apos;s Privacy Policy and Terms of Service.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
