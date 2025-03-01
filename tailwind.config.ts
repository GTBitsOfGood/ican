import type { Config } from "tailwindcss";
import type { PluginAPI } from "tailwindcss/types/config";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      mobile: "320px",
      tablet: "768px",
      desktop: "1024px",
      largeDesktop: "1280px",
      tall: {
        raw: "(min-height: 750px)",
      },
      short: {
        raw: "(max-height: 750px)",
      },
    },
    extend: {
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
      colors: {
        "iCAN-error": "#CE4E4E",
        "iCAN-textfield": "#747474",
        "iCAN-gray": "#626262",
        "iCAN-Blue-300": "#2C3694",
        "iCAN-Green": "#CEE0A0",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
        textGrey: "#626262",
        loginGreen: "#ACCC6E",
        borderGrey: "#747474",
        errorRed: "#CE4E4E",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        quantico: ["var(--font-quantico)", "sans-serif"],
        pixelify: ["var(--font-pixelify-sans)", "sans-serif"],
        belanosima: ["var(--font-belanosima)", "serif"],
      },
      boxShadow: {
        bubble: "0px 8px 0px 0px rgba(125,131,178,1.00)",
        "exp-outer": "inset 0px -4px 0px 0px rgba(0,0,0,0.14)",
        "exp-inner":
          "inset 0rem -0.375rem 0rem 0rem #718E1F, inset 0rem 0.25rem 0rem 0rem #DBEDA6",
        "button-outer":
          "0px 0px 0px 2px rgba(61,112,201,0.40), inset 0px 2px 1px 0px rgba(0,0,0,0.25)",
        "button-inner": "inset 0px 4px 0px 0px rgba(183,189,239,1.00)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      screens: {
        "4xl": "112rem",
      },
      aspectRatio: {
        "nav-button": "230 / 120",
        "feed-button": "265 / 113",
        "profile-picture": "145 / 154",
        "exp-bar": "262 / 29",
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
    },
  },
  plugins: [
    function ({ addBase, addUtilities, matchUtilities }: PluginAPI) {
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
        ".text-stroke-4": {
          "-webkit-text-stroke-width": "4px",
          "text-stroke-width": "4px",
        },
        ".paint-stroke": {
          "paint-order": "stroke fill",
        },
        ".letter-spacing-ui": {
          "letter-spacing": "-0.8px",
        },
      });
      matchUtilities(
        {
          "text-stroke": (value: string) => ({
            "-webkit-text-stroke-color": value,
            "text-stroke-color": value,
          }),
        },
        { type: ["color", "any"] },
      );

      matchUtilities(
        {
          "text-shadow": (value: string) => ({
            "text-shadow": `0px 4px 0px ${value}`,
          }),
        },
        { type: ["color", "any"] },
      );
      matchUtilities(
        {
          "letter-spacing": (value: string) => ({
            "letter-spacing": value,
          }),
        },
        { type: ["any"] },
      );
      addBase({
        ":root": {
          "--font-quantico": "'Quantico', sans-serif",
          "--font-pixelify": "'Pixelify Sans', sans-serif",
        },
      });
    },
  ],
} satisfies Config;
