import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0C0F14",
        surface: "#141920",
        "surface-2": "#1C232D",
        border: "#2A3341",
        amber: "#FFB338",
        mint: "#52E3B0",
        text: "#F3F5F8",
        muted: "#8D97A9",
        danger: "#FF7A6E",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      boxShadow: {
        block: "5px 5px 0 #52E3B0",
      },
    },
  },
  plugins: [],
};
export default config;
