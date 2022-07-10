import { buildSync } from 'esbuild';

buildSync({
  entryPoints: ['./src/init.ts'],
  bundle: true,
  platform: 'node',
  target: ['node10.0.0'],
  minify: true,
  outfile: './dist/node-agent-main.min.js',
  // external: ['fsevents'],
  // external: ['path'],
  // loader: {
  //   '.node': 'copy',
  // },
});
