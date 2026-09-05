import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        // Razorpay Authentic Design System
        razor: {
          navy: "#0C2451",
          "navy-dark": "#081A3A",
          "navy-deep": "#051229",
          "navy-card": "#10275D",
          "navy-light": "#16347A",
          blue: "#0A7AFF",
          "blue-vivid": "#3395FF",
          "blue-hover": "#0062D2",
          gray: "#F8F9FC",
          "gray-light": "#F1F5F9",
          "gray-border": "#E2E8F0",
          text: "#4A4A4A",
          "text-dark": "#1A1A1A",
          mint: "#00D09C",
          crimson: "#FF3366",
          amber: "#FFB800",
        },
      },
      fontFamily: {
        sans: [
          '"Inter"',
          "-apple-system",
          '"Segoe UI"',
          "sans-serif",
        ],
        mono: [
          '"JetBrains Mono"',
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "monospace",
        ],
      },
      letterSpacing: {
        headline: "-0.02em",
        tight: "-0.02em",
      },
      lineHeight: {
        body: "1.6",
      },
      boxShadow: {
        "razor-btn": "0 4px 18px 0 rgba(10, 122, 255, 0.38)",
        "razor-card": "0 10px 30px -5px rgba(12, 36, 81, 0.08)",
        "razor-card-hover": "0 20px 40px -10px rgba(12, 36, 81, 0.15)",
        "razor-dark-card": "0 15px 35px -5px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
