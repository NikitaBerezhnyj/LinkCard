import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import sonarjs from "eslint-plugin-sonarjs";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    plugins: {
      sonarjs
    },
    rules: {
      ...sonarjs.configs.recommended.rules,

      "react-hooks/set-state-in-effect": "off",

      "no-unused-vars": [
        "warn",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true
        }
      ],

      "no-console": "off",

      "sonarjs/no-commented-code": "off",
      "sonarjs/pseudo-random": "off",
      "sonarjs/cognitive-complexity": ["warn", 15]
    }
  },

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"])
]);

export default eslintConfig;
