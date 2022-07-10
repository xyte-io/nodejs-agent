import authenticateDevice from './authentication.js';
import notifyServerLoop from './scheduler.js';
import { INTERVAL_IN_MS } from './helpers/constants.js';

async function main() {
  console.log('-----------------------------------------------------------------------------------------');
  console.group('Main fn');
  try {
    const authConfig = await authenticateDevice();

    if (!authConfig) {
      throw new Error('Critical Error: missing device auth configuration. unable to proceed. exiting!');
    }

    await notifyServerLoop(authConfig.id, authConfig.access_key);
  } catch (error) {
    console.error(error);

    console.log('Main fn catch - Restarting in:', INTERVAL_IN_MS);
    setTimeout(async () => await main(), INTERVAL_IN_MS);
  } finally {
    console.groupEnd();
  }
}

export default main;
