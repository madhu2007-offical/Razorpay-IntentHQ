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
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../../lib/AuthContext";
import GoogleAuthModal from "../../components/GoogleAuthModal";

export default function LoginPage() {
  const { loginWithEmail } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const derivedName = email.split("@")[0].replace(/[._]/g, " ");
      const formattedName = derivedName
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      await loginWithEmail(formattedName || "FinTech Architect", email);
      router.push("/#interactive-arena");
    } catch (err: any) {
      setError(err.message || "Failed to log in");
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

          <div className="space-y-6 max-w-md">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#10275D] border border-[#1E3B82] text-xs font-mono font-bold text-[#3395FF]">
              <Sparkles className="w-3.5 h-3.5 text-[#00D09C]" />
              <span>Zero-Trust Control Plane</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-[-0.02em] leading-tight font-sans">
              Welcome back to IntentHQ Control Plane.
            </h1>

            <p className="text-[16px] text-[#CBD5E1] leading-[1.6]">
              Access your real-time agent verification telemetry, Z3 invariant solvers, and RFC 6962 cryptographic proof records.
            </p>

            <div className="space-y-3 pt-4 border-t border-[#1E3B82]/70">
              <div className="flex items-center space-x-3 text-sm text-[#CBD5E1]">
                <CheckCircle2 className="w-5 h-5 text-[#00D09C] flex-shrink-0" />
                <span>Live telemetry with sub-45ms P99 SLA verification</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-[#CBD5E1]">
                <CheckCircle2 className="w-5 h-5 text-[#00D09C] flex-shrink-0" />
                <span>One-click Ed25519 token minting &amp; inspection</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-[#CBD5E1]">
                <CheckCircle2 className="w-5 h-5 text-[#00D09C] flex-shrink-0" />
                <span>Downloadable cryptographic JSON audit certificates</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 mt-12 border-t border-[#1E3B82]/50 text-xs text-[#94A3B8]">
          Razorpay Software Private Limited • ISO 27001 &amp; PCI-DSS Level 1 Certified
        </div>
      </div>

      {/* Right Column: Clean White Login Form */}
      <div className="lg:w-7/12 bg-white p-8 sm:p-12 lg:p-20 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-xs font-bold text-[#64748B] hover:text-[#0C2451] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to IntentHQ Arena</span>
          </Link>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-[#0C2451] tracking-[-0.02em] font-sans">
              Log in to your account
            </h2>
            <p className="text-[16px] text-[#4A4A4A] mt-2 leading-[1.6]">
              Choose your preferred sign-in method below.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[#FF3366]/10 border border-[#FF3366]/30 text-xs text-[#FF3366] font-semibold">
              {error}
            </div>
          )}

          {/* Google Login Button */}
          <button
            type="button"
            onClick={() => setGoogleModalOpen(true)}
            className="w-full py-3.5 px-4 rounded-2xl border border-[#CBD5E1] hover:border-[#0A7AFF] hover:bg-[#F8F9FC] text-[#0C2451] font-bold text-sm flex items-center justify-center space-x-3 transition-all shadow-sm group hover:shadow-md"
          >
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
              Continue with Google
            </span>
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E2E8F0]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-[#94A3B8] font-mono">
                or sign in with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#4A4A4A] block mb-1.5">
                Work Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] text-sm text-[#0C2451] focus:outline-none focus:border-[#0A7AFF] focus:ring-2 focus:ring-[#0A7AFF]/20 transition-all placeholder-[#94A3B8]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#4A4A4A]">Password</label>
                <a href="#" className="text-xs text-[#0A7AFF] hover:underline font-semibold">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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

            <button
              type="submit"
              disabled={submitting}
              className="w-full razor-btn-primary py-3.5 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-[#0A7AFF]/30"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-[#64748B]">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/signup"
              className="font-bold text-[#0A7AFF] hover:underline"
            >
              Sign up for free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
