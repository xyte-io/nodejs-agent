import { buildSync } from 'esbuild';

buildSync({
  entryPoints: ['./scripts/forever.js'],
  bundle: true,
  platform: 'node',
  target: ['node18.5.0'],
  minify: true,
  outfile: './dist/node-agent-starter.min.js',
});
