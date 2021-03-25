import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import replace from '@rollup/plugin-replace';
import { config } from "dotenv";
import serve from "./app";

config();

const HOST = process.env.HOST;
const PORT = process.env.PORT;
const PORT_DEV = process.env.PORT_DEV;
const PASSWORD = process.env.PASSWORD;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const PRIVATE_PATHS = ['images', 'private'];

const production = !process.env.ROLLUP_WATCH;
const preprocessOptions = require("./svelte.config").preprocessOptions;

export default {
	input: ['src/main.ts'],
	output: {
		sourcemap: !production,
		format: "iife",
		file: 'public/build/bundle.js',
		name: 'app',
	},
	plugins: [
		svelte({
			preprocess: [
				sveltePreprocess({
					sourceMap: !production,
					postcss: true,
					...preprocessOptions
				}),
			],
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),
		replace({
			preventAssignment: true,
			'isDevelopment': !production,
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte'],
			moduleDirectories: ['node_modules', '.']
		}),
		commonjs(),
		typescript({
			sourceMap: !production,
			inlineSources: !production,
		}),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload({
			watch: 'public',
			exts: ['html', 'js', 'css', 'json'],
			port: 5001,
			verbose: true,
		}),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),

		serve({
			host: HOST,
			port: production ? PORT : (PORT_DEV || PORT),
			publicPath: 'public',
			authentication: {
				password: PASSWORD,
				token: ACCESS_TOKEN,
				privatePaths: PRIVATE_PATHS,
			},
			dev: !production,
		}),
	],
	watch: {
		clearScreen: false
	}
};
