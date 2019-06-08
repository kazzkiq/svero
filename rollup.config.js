import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.js',
	output: [{
		sourcemap: false,
		format: 'umd',
		name: 'svero',
		file: 'build/svero.min.js'
	}, {
		sourcemap: false,
		format: 'es',
		file: 'build/svero.mjs'
	}],
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
		}),
		resolve(),
		commonjs(),
		production && terser()
	]
};
