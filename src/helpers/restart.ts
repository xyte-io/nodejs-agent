import process from 'node:process';
import path from 'node:path';
import { spawn } from 'node:child_process';

const restart = () => {
  const { env, argv } = process;
  env._argv = JSON.stringify(argv);

  spawn(argv[0], [path.resolve('main.js')], {
    detached: true,
    stdio: 'inherit',
    env,
  });

  process.exit();
};

export default restart;
