import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../lib/AuthContext";

export const metadata: Metadata = {
  title: "Razorpay IntentHQ | Zero-Trust Intent Control Plane",
  description: "Inline Sub-45ms Neuro-Symbolic Intent-to-Transaction Control Plane for Autonomous AI Agents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-[#1A1A1A] font-sans antialiased min-h-screen selection:bg-[#0A7AFF]/20 selection:text-[#0A7AFF]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
