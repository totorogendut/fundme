import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel'
import swc from 'rollup-plugin-swc'

const extensions = [
  '.js', '.jsx', '.ts', '.tsx',
];

export default {
  input: 'fundme.ts',
  external: [],
  plugins: [
    resolve({ extensions }),
    commonjs(),
    swc({
      jsc: {
        parser: {
          syntax: 'typescript',
        },
        target: 'es2018',
      },
    }),
    // babel({ extensions, babelHelpers: 'bundled', include: ['src/**/*'] }),
  ],
  output: [{
    file: 'dist/fundme-iife.js',
    format: 'iife',
    name: 'fundme'
  }, {
    file: 'dist/fundme-cjs.js',
    format: 'cjs'
  }, {
    file: 'dist/fundme.mjs',
    format: 'es'
  }, {
    file: 'dist/fundme-amd.js',
    format: 'amd',
  }]
};
