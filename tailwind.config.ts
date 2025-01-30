import type { Config } from "tailwindcss";

export default {
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
        icanBlue: {
          100: "#7D83B2",
          200: "#4C539B",
          300: "#2C3694",
        },
        icanGreen: {
          100: "#CEE0A0",
          200: "#ACCC6E",
          300: "#98D03B",
        },
      },
      fontFamily: {
        quantico: ["Quantico", "sans-serif"],
        pixelify: ["Pixelify Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
