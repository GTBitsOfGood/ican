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
        textGrey: "#626262",
        loginGreen: "#ACCC6E",
        borderGrey: "#747474",
        errorRed: "#CE4E4E",
      },
      textStrokeWidth: {
        "1": "1px",
        "2": "2px",
        "3": "3px",
      },
      textStrokeColor: {
        default: "#2C3694",
      },
      textShadow: {
        default: "0 4px 0 #7D83B2",
      },
      fontFamily: {
        quantico: ["var(--font-quantico)", "sans-serif"],
      },
    },
  },
  plugins: [
    function ({
      addUtilities,
    }: {
      addUtilities: (utilities: Record<string, Record<string, string>>) => void;
    }) {
      addUtilities({
        ".text-stroke-1": {
          "-webkit-text-stroke-width": "1px",
          "text-stroke-width": "1px",
        },
        ".text-stroke-2": {
          "-webkit-text-stroke-width": "2px",
          "text-stroke-width": "2px",
        },
        ".text-stroke-3": {
          "-webkit-text-stroke-width": "3px",
          "text-stroke-width": "3px",
        },
        ".text-stroke-default": {
          "-webkit-text-stroke-color": "#2C3694",
          "text-stroke-color": "#2C3694",
        },
        ".text-shadow-default": {
          "text-shadow": "0 4px 0 #7D83B2",
        },
      });
    },
  ],
} satisfies Config;
