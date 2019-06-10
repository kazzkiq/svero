import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const isDev = process.env.ROLLUP_WATCH;
const isProd = process.env.NODE_ENV === 'production';

function bundle(file, format) {
  return {
    sourcemap: false,
    name: 'svero',
    format,
    file,
  };
}

export default {
  input: isProd ? 'src/main.js' : 'test/main.js',
  output: isProd ? [
    bundle('dist/svero.js', 'cjs'),
    bundle('dist/svero.es.js', 'es'),
    bundle('dist/svero.min.js', 'umd'),
  ] : bundle('test/public/test.js', 'iife'),
  external: isProd ? ['svelte', 'svelte/store', 'svelte/internal'] : [],
  plugins: [
    svelte({
      dev: isDev,
    }),
    resolve(),
    commonjs(),
    isProd && terser(),
  ],
};
