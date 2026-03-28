import tanstackQuery from "@tanstack/eslint-plugin-query"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import { defineConfig, globalIgnores } from "eslint/config"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...tanstackQuery.configs["flat/recommended"],

  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },

  {
    files: ["src/components/ui/**/*.{ts,tsx}", "src/components/ai-elements/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/purity": "off",
      "react-hooks/immutability": "off",
      "react-hooks/static-components": "off",
      "react/no-children-prop": "off",
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },

  {
    files: ["scripts/**/*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
])

export default eslintConfig
