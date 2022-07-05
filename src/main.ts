import authenticateDevice from './authentication.js';
import notifyServerLoop from './scheduler.js';
import { setShutdownToStorage } from './helpers/storage.js';
import { INTERVAL_IN_MS, TURNED_OFF_FILE_NAME } from './helpers/constants.js';

// handling termination requests
// other event you might find useful: uncaughtException, unhandledRejection, SIGINT
process.on('SIGTERM', () => {
  console.group('SIGTERM fn');
  console.log(`Process ${process.pid} received a SIGTERM signal`);
  console.log('Attempting to write graceful shutdown message to', TURNED_OFF_FILE_NAME);

  setShutdownToStorage();

  console.groupEnd();
});

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

// program starts here:
(async () => {
  console.log('-----------------------------------------------------------------------------------------');
  console.log('Starting Xyte`s agent');
  await main();
})();
