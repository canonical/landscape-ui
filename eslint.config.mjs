// @ts-check

import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: [
      "dist",
      "dist-ssr",
      "node_modules",
      "playwright-report",
      "playwright",
      "public",
      "src/**/*.module.scss.d.ts",
    ],
  },

  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  reactHooks.configs.flat.recommended,

  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: { "react-hooks": reactHooks },
    rules: {
      "react-hooks/immutability": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/rules-of-hooks": "warn",
      "react-hooks/set-state-in-effect": "warn",
    },
  },

  {
    ...reactPlugin.configs.flat.recommended,
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  eslintPluginPrettierRecommended,

  {
    files: ["**/*.{ts,tsx}"],

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.jest,
      },

      ecmaVersion: 5,

      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },

      sourceType: "module",
    },

    rules: {
      "linebreak-style": ["error", "unix"],
      semi: ["error", "always"],
      "object-curly-spacing": ["error", "always"],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react/self-closing-comp": [
        "error",
        {
          component: true,
          html: true,
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: ["@/features/*/*"],
        },
      ],
      "react/prefer-read-only-props": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-magic-numbers": [
        "error",
        {
          ignore: [
            -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 60, 90, 180, 270, 360, 16, 32,
            64, 128, 256, 512, 1024, 2048, 4096, 8192, 100, 1000, 10000, 100000,
            1000000,
          ],
        },
      ],
      "no-nested-ternary": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "warn",

      /* These rules are set to warning to meet TICS rules. They will be changed to errors in the future. */
      complexity: ["warn", 20],
      "no-use-before-define": "warn",
      "prefer-destructuring": "warn",
      "@typescript-eslint/prefer-string-starts-ends-with": "warn",
      "@typescript-eslint/no-confusing-void-expression": "warn",
      "no-shadow": "warn",
    },
  },
);
