import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: "#f0f8ff",
          100: "#e0f1fe",
          200: "#bae3fd",
          300: "#7dcefc",
          400: "#38b3f8",
          500: "#0e98e9",
          600: "#0279c7",
          700: "#0361a1",
          800: "#075385",
          900: "#0c456e",
          950: "#082c49",
        },
        sand: {
          50: "#fffaf2",
          100: "#fef3e2",
          200: "#fde2bd",
          300: "#fbcd8a",
          400: "#f8ad54",
          500: "#f58f2e",
          600: "#e67318",
          700: "#bf5814",
          800: "#984718",
          900: "#7b3c17",
        },
        namako: {
          black: "#0d0d10",
          gold: "#c9a227",
          ivory: "#f4f1ea",
        },
        restaurant: {
          cream: "#f7efe2",
          rust: "#6f2418",
          ink: "#2d1812",
        },
        komugi: {
          cream: "#faf7f2",
          ink: "#4a3728",
          rust: "#a8503c",
        },
        salon: {
          white: "#fbfbf8",
          line: "#d8d4cc",
          ink: "#1c1c1a",
        },
        koumuten: {
          navy: "#0f2438",
          wood: "#b87943",
          mist: "#eef2f1",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-noto-sans-jp)",
          "Noto Sans JP",
          "system-ui",
          "sans-serif",
        ],
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
