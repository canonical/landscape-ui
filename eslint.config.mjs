// @ts-check

import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import reactPlugin from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist", "dist-ssr"],
  },

  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,

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

      /* These rules are set to warning to meet TICS rules. They will be changed to errors in the future. */
      complexity: ["warn", 20],
      "no-magic-numbers": "warn",
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/promise-function-async": "warn",
      "no-use-before-define": "warn",
    },
  },
);
