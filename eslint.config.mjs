import { defineConfig } from "eslint/config"
import react from "eslint-plugin-react"
import globals from "globals"
import path from "node:path"
import { fileURLToPath } from "node:url"
import js from "@eslint/js"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
})

export default defineConfig([{
	extends: compat.extends("eslint:recommended", "plugin:react/recommended"),

	plugins: {
		react,
	},

	languageOptions: {
		globals: {
			...globals.browser,
			...globals.node,
		},

		ecmaVersion: "latest",
		sourceType: "module",
	},

	rules: {
		indent: ["error", "tab"],
		"linebreak-style": ["error", "unix"],
		quotes: ["error", "double"],
		semi: ["error", "never"],
	},
}, {
	files: ["**/.eslintrc.{js,cjs}"],

	languageOptions: {
		globals: {
			...globals.node,
		},

		ecmaVersion: 5,
		sourceType: "commonjs",
	},
}, {
	ignores: [
		"node_modules/**",
		"build/**",
		"dev-dist/**",
		"playwright-report/**",
		"playwright.config.js",
	],
}, {
	settings: {
		react: {
			version: "detect",
		},
	},
}])