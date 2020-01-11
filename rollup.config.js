import webcomponents from './rollup-plugin-webcomponents'

module.exports = {
  input: 'src/components/index.js',
  output: {
    file: 'src/components/bundle.js',
    format: 'esm',
  },
  plugins: [webcomponents({ include: ['**/components/**/*.html'] })],
}
