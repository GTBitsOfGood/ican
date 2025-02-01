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
      boxShadow: {
        'bubble': "0px 8px 0px 0px rgba(125,131,178,1.00)",
        'exp-outer': "inset 0px -4px 0px 0px rgba(0,0,0,0.14)",
        'exp-inner': "inset 0rem -0.375rem 0rem 0rem #718E1F, inset 0rem 0.25rem 0rem 0rem #DBEDA6",
        'button-outer': "0px 0px 0px 2px rgba(61,112,201,0.40), inset 0px 2px 1px 0px rgba(0,0,0,0.25)",
        'button-inner': "inset 0px 4px 0px 0px rgba(183,189,239,1.00)"
      },
      screens: {
        '4xl': '112rem',
      },
      aspectRatio: {
        'nav-button': "230 / 120",
        'feed-button': "265 / 113",
        'profile-picture': "145 / 154",
        'exp-bar': "262 / 29"
      },
    },  
  },
  plugins: [],
} satisfies Config;
