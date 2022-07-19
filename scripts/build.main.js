import { buildSync } from 'esbuild';

buildSync({
  entryPoints: ['./src/init.ts'],
  bundle: true,
  platform: 'node',
  target: ['node18.5.0'],
  minify: true,
  outfile: './dist/node-agent-main.min.js',
});
