import baseConfig from "./eslint.config.mjs";

export default [
  ...baseConfig,

  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "no-console": ["error", { allow: ["warn", "error"] }],
    },
  },
  {
    files: ["src/tests/browser.ts"],
    rules: {
      "no-console": "off",
    },
  },
];
