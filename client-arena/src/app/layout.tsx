import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="dark">
      <body className="bg-[#09090b] text-[#fafafa] antialiased min-h-screen selection:bg-emerald-500/20 selection:text-emerald-400">
        {children}
      </body>
    </html>
  );
}
