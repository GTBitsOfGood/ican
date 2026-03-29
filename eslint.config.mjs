import path from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import prettier from "eslint-config-prettier/flat";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.{js,jsx,mjs,ts,tsx,mts,cts}"],
    settings: {
      react: {
        version: "19.2",
      },
    },
  },
  {
    ignores: [".netlify/**"],
  },
  prettier,
];

export default config;
