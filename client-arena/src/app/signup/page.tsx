"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  Cpu,
  Zap,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../../lib/AuthContext";
import GoogleAuthModal from "../../components/GoogleAuthModal";

export default function SignupPage() {
  const { loginWithEmail, user } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("AI Agent Commerce Developer");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please complete all required fields");
      return;
    }
    if (!agreeTerms) {
      setError("Please agree to the Razorpay Terms and Privacy Policy");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await loginWithEmail(name, email, role);
      router.push("/#interactive-arena");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col lg:flex-row">
      {/* Google Auth Modal */}
      <GoogleAuthModal
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
      />

      {/* Left Column: Razorpay Navy Showcase Panel */}
      <div className="lg:w-5/12 bg-[#0C2451] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Glow Ambient */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#0A7AFF]/25 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div>
          {/* Brand Logo */}
          <Link href="/" className="inline-flex items-center space-x-2.5 mb-12 group">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-9 h-9 transition-transform group-hover:scale-105"
            >
              <path d="M48.8 8L20 92H38L52.5 49.5L68 49.5L59 92H77L96 8L48.8 8Z" fill="#0A7AFF" />
              <path d="M34.5 49.5L40.5 32L61.5 32L55.5 49.5L34.5 49.5Z" fill="#3395FF" />
            </svg>
            <div className="flex items-baseline space-x-1.5">
              <span className="font-extrabold text-2xl tracking-[-0.02em] text-white font-sans">
                Razorpay
              </span>
              <span className="font-bold text-2xl tracking-[-0.02em] text-[#3395FF]">
                Intent<span className="text-[#00D09C]">HQ</span>
              </span>
            </div>
          </Link>

          {/* Value Prop */}
          <div className="space-y-6 max-w-md">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#10275D] border border-[#1E3B82] text-xs font-mono font-bold text-[#3395FF]">
              <Sparkles className="w-3.5 h-3.5 text-[#00D09C]" />
              <span>Zero-Trust Control Plane</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-[-0.02em] leading-tight font-sans">
              Verify Autonomous AI Agent Payments Inline.
            </h1>

            <p className="text-[16px] text-[#CBD5E1] leading-[1.6]">
              Join over 150,000 businesses securing payments against prompt injections, unauthorized gift card adds, and budget drift.
            </p>

            <div className="space-y-3 pt-4 border-t border-[#1E3B82]/70">
              <div className="flex items-center space-x-3 text-sm text-[#CBD5E1]">
                <CheckCircle2 className="w-5 h-5 text-[#00D09C] flex-shrink-0" />
                <span>Sub-45ms P99 decision latency with zero LLM API calls</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-[#CBD5E1]">
                <CheckCircle2 className="w-5 h-5 text-[#00D09C] flex-shrink-0" />
                <span>Microsoft Z3 theorem prover for formal budget bounds</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-[#CBD5E1]">
                <CheckCircle2 className="w-5 h-5 text-[#00D09C] flex-shrink-0" />
                <span>RFC 6962 append-only Merkle inclusion certificates</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-[#CBD5E1]">
                <CheckCircle2 className="w-5 h-5 text-[#00D09C] flex-shrink-0" />
                <span>100% Sandbox &amp; Production idempotency protection</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Social Proof */}
        <div className="pt-12 mt-12 border-t border-[#1E3B82]/50">
          <div className="bg-[#10275D]/80 border border-[#1E3B82] rounded-2xl p-5">
            <p className="text-xs text-[#CBD5E1] italic leading-relaxed">
              &ldquo;IntentHQ gives our board mathematical certainty that autonomous purchasing agents cannot be coerced by prompt injection or cart swaps.&rdquo;
            </p>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-xs font-bold text-white">CTO, Quick-Commerce Unicorn</div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00D09C]/15 text-[#00D09C] font-bold">
                100% BLOCKED
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Clean White Signup Form */}
      <div className="lg:w-7/12 bg-white p-8 sm:p-12 lg:p-20 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-xs font-bold text-[#64748B] hover:text-[#0C2451] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to IntentHQ Arena</span>
          </Link>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-[#0C2451] tracking-[-0.02em] font-sans">
              Create your account
            </h2>
            <p className="text-[16px] text-[#4A4A4A] mt-2 leading-[1.6]">
              Sign up in 30 seconds to inspect live telemetry and simulate attacks.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[#FF3366]/10 border border-[#FF3366]/30 text-xs text-[#FF3366] font-semibold">
              {error}
            </div>
          )}

          {/* Working Google Sign-Up Button */}
          <button
            type="button"
            onClick={() => setGoogleModalOpen(true)}
            className="w-full py-3.5 px-4 rounded-2xl border border-[#CBD5E1] hover:border-[#0A7AFF] hover:bg-[#F8F9FC] text-[#0C2451] font-bold text-sm flex items-center justify-center space-x-3 transition-all shadow-sm group hover:shadow-md"
          >
            {/* Google G Logo */}
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
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
            <span className="group-hover:text-[#0A7AFF] transition-colors">
              Sign up with Google
            </span>
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E2E8F0]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-[#94A3B8] font-mono">
                or continue with work email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#4A4A4A] block mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Madhusudhanan S"
                className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] text-sm text-[#0C2451] focus:outline-none focus:border-[#0A7AFF] focus:ring-2 focus:ring-[#0A7AFF]/20 transition-all placeholder-[#94A3B8]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#4A4A4A] block mb-1.5">
                Work Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="madhu@company.com"
                className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] text-sm text-[#0C2451] focus:outline-none focus:border-[#0A7AFF] focus:ring-2 focus:ring-[#0A7AFF]/20 transition-all placeholder-[#94A3B8]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#4A4A4A] block mb-1.5">
                Primary Business Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] text-sm text-[#0C2451] bg-white focus:outline-none focus:border-[#0A7AFF] focus:ring-2 focus:ring-[#0A7AFF]/20 transition-all"
              >
                <option value="AI Agent Commerce Developer">AI Agent Commerce Developer</option>
                <option value="FinTech / Merchant Risk Officer">FinTech / Merchant Risk Officer</option>
                <option value="Full-Stack Payment Engineer">Full-Stack Payment Engineer</option>
                <option value="Enterprise Platform Architect">Enterprise Platform Architect</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#4A4A4A] block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-[#CBD5E1] text-sm text-[#0C2451] focus:outline-none focus:border-[#0A7AFF] focus:ring-2 focus:ring-[#0A7AFF]/20 transition-all placeholder-[#94A3B8]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-[#94A3B8] hover:text-[#0C2451] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="pt-2 flex items-start space-x-2.5">
              <input
                id="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded border-[#CBD5E1] text-[#0A7AFF] focus:ring-[#0A7AFF] mt-0.5"
              />
              <label htmlFor="terms" className="text-xs text-[#64748B] leading-tight">
                I agree to Razorpay&apos;s{" "}
                <a href="https://razorpay.com/terms" target="_blank" rel="noreferrer" className="text-[#0A7AFF] underline">
                  Terms of Service
                </a>{" "}
                and acknowledge the{" "}
                <a href="https://razorpay.com/privacy" target="_blank" rel="noreferrer" className="text-[#0A7AFF] underline">
                  Privacy Policy
                </a>.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full razor-btn-primary py-3.5 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-[#0A7AFF]/30"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account &amp; Launch Arena</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Login Link */}
          <div className="mt-8 text-center text-xs text-[#64748B]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[#0A7AFF] hover:underline"
            >
              Log In here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
