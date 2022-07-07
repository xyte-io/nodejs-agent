import { buildSync } from 'esbuild';

buildSync({
  entryPoints: ['./scripts/forever.js'],
  bundle: true,
  platform: 'node',
  target: ['node10.0.0'],
  minify: true,
  outfile: './dist/node-agent-starter.min.js',
});
