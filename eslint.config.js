import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import eslintImport from "eslint-plugin-import";
import { defineConfig, globalIgnores } from 'eslint/config'
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

//================================================

const internalImportsOrder = [
  "@(~/api)",
  "@(~/app)",
  "@(~/data)",
  "@(~/context)",
  "@(~/routing)",
  "@(~/theme)",
  "@(~/utils)",
  "@(~/components)",
  "~/components/*",
  "@(~/assets)",
];

const muiExternalImportsOrder = [
  "@mui/base/**",
  "@mui/material/styles",
  "@mui/material/useMediaQuery",
  "@mui/system/**",
  "@mui/utils",
];

const muiComponentImportsOrder = ["@mui/material/**", "@mui/icons-material/*"];


export const importConfig = {
  parser: "@typescript-eslint/parser",
  extends: ["plugin:@typescript-eslint/recommended"],
  plugins: {"import": eslintImport},
  overrides: [
    {
      files: ["**/*.{ts,tsx}"],
      rules: {

      },
    },
  ],
  ignorePatterns: ["dist/**/*", "**/*.html", "**/*.min.js"],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        project: ["tsconfig.app.json"],
      },
    },
  },
};

//================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const overridesCompat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: tseslint.configs.recommended,
});

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['src/**/*.{ts,tsx,cts,mts,js,jsx,cjs,mjs}'],
    plugins: {"import": eslintImport},
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/consistent-type-imports": "error",
      "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
      "import/no-anonymous-default-export": "off",
      "import/no-unresolved": "error",
      "import/no-duplicates": "error",
      "import/no-internal-modules": [
        "error",
        {
          forbid: [
            "@mui/*/*/**",
            "@mui/material",
            "@mui/icons-material",
            "~/components/**/*",
            "~/components/!(routes)",
            "~/utils/**",
            "~/theme/**",
            "~/app/**",
            "~/api/**",
            "~/context/**",
            "~/routing/**",
            "~/assets/**",
            "~/data/**",
            "./*/**",
            "../*/**",
            "../../*/**",
            "../../../*/**",
            "../../../../*/**",
          ],
        },
      ],
      "import/order": [
        "error",
        {
          "newlines-between": "always",
          groups: [
            ["builtin", "external"],
            ["internal"],
            ["parent", "sibling", "index", "object"],
            ["unknown"],
            "type",
          ],
          pathGroups: [
            ...muiExternalImportsOrder.map(pattern => ({
              pattern,
              group: "external",
            })),
            ...internalImportsOrder.map(pattern => ({
              pattern,
              group: "internal",
            })),
            ...muiComponentImportsOrder.map(pattern => ({
              pattern,
              group: "unknown",
            })),
          ],
          distinctGroup: false,
          pathGroupsExcludedImportTypes: ["type"],
        },
      ],
    },
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/extensions": ['.ts', '.tsx'],
      "import/resolver": {
        node: {
          moduleDirectory: ["node_modules", "./src", "./public"]
        },
        typescript: {
          project: ["./tsconfig.app.json"],
        },
      },
    }
  },
])

