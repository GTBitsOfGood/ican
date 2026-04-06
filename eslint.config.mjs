import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "eslint-config-prettier/flat";

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const config = [
  ...compat.extends(
    "plugin:@next/next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
  ),
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
