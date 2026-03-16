import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const config = [
  ...nextCoreWebVitals,
  ...nextTypeScript,
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
