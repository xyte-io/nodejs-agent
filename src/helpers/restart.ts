import process from "node:process";
import { join } from "node:path";
import { spawn } from "node:child_process";

const restart = () => {
  const { env, argv } = process;
  env._argv = JSON.stringify(argv);

  spawn(argv[0], [join(__dirname, '..', "main.js")], {
    detached: true,
    stdio: "inherit",
    env,
  });

  process.exit();
};

export default restart;