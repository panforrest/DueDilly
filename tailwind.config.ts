import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#070B14",
        panel: "rgba(14, 22, 38, 0.72)",
        line: "#1E2A44",
        accent: "#3EE8FF",
        claim: "#FFB547",
        ok: "#4DFF9A",
        err: "#FF4D6A",
        mem: "#A77BFF",
        muted: "#8A97B4",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
