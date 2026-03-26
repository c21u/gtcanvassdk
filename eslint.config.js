import prettierPlugin from "eslint-plugin-prettier/recommended";
import globals from "globals";
import eslint from "@eslint/js";

export default [
  {
    ...eslint.configs.recommended,
    files: ["**/*.js"],
    ignores: ["dist/*", "src/*"],
    rules: {
      "no-undef": "error",
    },
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
  },
  prettierPlugin,
];
