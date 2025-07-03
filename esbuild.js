import { build } from 'esbuild'

build({
  bundle: true,
  entryPoints: ['./src/main.ts'],
  external: ['esbuild'],
  target: 'es6',
  minify: true,
  format: 'cjs',
  outfile: './dist/main.js',
  // watch: Boolean(process.env.ESBUILD_WATCH),
  platform: 'node',
  plugins: []
})
