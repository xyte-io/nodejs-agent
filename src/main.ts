import authenticateDevice from './authentication.js';
import notifyServerLoop from './scheduler.js';
import { INTERVAL_IN_MS } from './helpers/constants.js';

async function main() {
  try {
    const authConfig = await authenticateDevice();

    if (!authConfig) {
      throw new Error('Authentication failed');
    }

    await notifyServerLoop(authConfig);

  } catch (error) {
    console.error(`Restarting main loop due to (${error}) Restarting in: ${INTERVAL_IN_MS}`);

    setTimeout(async () => await main(), INTERVAL_IN_MS);
  }
}

export default main;
