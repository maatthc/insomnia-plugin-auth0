import { build } from 'esbuild'
import vuePlugin from 'esbuild-plugin-vue3'
import InlineCSSPlugin from 'esbuild-plugin-inline-css'

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
  loader: {
    '.svg': 'text',
    '.html': 'text',
    '.png': 'dataurl'
  },
  plugins: [vuePlugin(), InlineCSSPlugin()]
})
