import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'test/main.js',
	output: {
		sourcemap: false,
		format: 'iife',
		name: 'svero',
		file: 'test/public/test.js'
	},
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
		}),
		resolve(),
		commonjs(),
	]
};
