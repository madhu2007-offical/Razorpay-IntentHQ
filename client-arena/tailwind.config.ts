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
        razorpay: {
          blue: "#0B72E7",
          "blue-hover": "#095ec0",
          "blue-light": "#3395FF",
          navy: "#02042B",
          "navy-card": "#0B1536",
          "navy-hover": "#0F1F4D",
          "navy-border": "#1E3269",
          cyan: "#00D09C",
          "cyan-light": "#00F2FE",
          accent: "#528FF0",
        },
      },
      fontFamily: {
        sans: ["Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande", "Segoe UI", "sans-serif"],
        mono: ["Consolas", "Courier New", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "monospace"],
      },
      boxShadow: {
        "razor-blue": "0 4px 25px -2px rgba(11, 114, 231, 0.45)",
        "razor-cyan": "0 4px 25px -2px rgba(0, 208, 156, 0.45)",
        "razor-card": "0 10px 30px -5px rgba(2, 4, 43, 0.8)",
      },
      backgroundImage: {
        "hero-gradient": "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(11, 114, 231, 0.35), rgba(2, 4, 43, 0))",
        "card-glow": "linear-gradient(180deg, rgba(30, 50, 105, 0.5) 0%, rgba(11, 21, 54, 0.7) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
