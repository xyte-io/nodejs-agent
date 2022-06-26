import { setTimeout } from 'timers/promises';
import restart from './helpers/restart';
import authenticateDevice from './authentication';
import notifyServerLoop from './scheduler';
import { INTERVAL_IN_MS } from './helpers/constants';

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

    await setTimeout(INTERVAL_IN_MS, async () => await main());

    throw error;
  }
}

// program starts here:
await main();
