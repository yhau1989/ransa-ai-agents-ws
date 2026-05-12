import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ransa: {
          // Verde principal (RANSA green)
          50: "#f0faf5",
          100: "#dff5e8",
          200: "#bfe9d5",
          300: "#9ddcbd",
          400: "#5cc695",
          500: "#2dad73",
          600: "#1a8c4e",
          700: "#00a651", // Main brand color
          800: "#007a3a",
          900: "#005c2e",
          950: "#003d1f",
          // Naranja/Rojo acento
          accent: "#FF6B35",
          "accent-light": "#FFB59A",
          "accent-dark": "#D63C1F",
        },
      },
    },
  },
};

export default config;
