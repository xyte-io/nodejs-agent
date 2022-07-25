import { buildSync } from 'esbuild';

buildSync({
  entryPoints: ['./src/init.ts'],
  bundle: true,
  platform: 'node',
  target: ['node10.0.0'],
  define: { 'import.meta.url': 'import_meta_url' },
  inject: ['./scripts/node10/import_meta_url.polyfill.js'],
  minify: true,
  outfile: './dist/node10/node-agent-main.min.js',
});
