import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#07090f",
        foreground: "#f3f4f6",
        card: "#10141f",
        accent: "#3b82f6"
      }
    }
  },
  plugins: []
};

export default config;
