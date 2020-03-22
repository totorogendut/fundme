import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'fundme.ts',
  plugins: [typescript()],
  output: [{
    file: 'dist/fundme-iife.js',
    format: 'iife',
    name: 'fund'
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
