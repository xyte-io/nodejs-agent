import restart from './helpers/restart.js';
import authenticateDevice from './authentication.js';
import notifyServerLoop from './scheduler.js';
import { INTERVAL_IN_MS } from './helpers/constants.js';

process.on('uncaughtException', (err: typeof Error) => {
  console.error('Error occurred:', err);

  restart();
});

process.on('SIGTERM', () => {
  console.error('SIGTERM');

  restart();
});

async function main() {
  try {
    const authConfig = await authenticateDevice();

    if (!authConfig) {
      throw new Error('Critical Error: missing device auth configuration. unable to proceed. exiting!');
    }

    await notifyServerLoop(authConfig.id, authConfig.access_key);
  } catch (error) {
    console.error(error);

    setTimeout(async () => await main(), INTERVAL_IN_MS);
  }
}

// program starts here:
(async () => {
  await main();
})();
