import fs from 'fs';
import path from 'path';
import authenticateDevice from './authentication.js';
import notifyServerLoop from './scheduler.js';
import { bootstrap } from './helpers/storage.js';
import { INTERVAL_IN_MS, TURNED_OFF_FILE_NAME } from './helpers/constants.js';

// handling termination requests
// other event you might find useful: uncaughtException, unhandledRejection, SIGINT
process.on('SIGTERM', () => {
  console.group('SIGTERM fn');
  console.log(`Process ${process.pid} received a SIGTERM signal`);
  console.log('Attempting to write graceful shutdown message to', TURNED_OFF_FILE_NAME);

  fs.writeFileSync(path.resolve(TURNED_OFF_FILE_NAME), '', 'ascii');

  console.groupEnd();

  // INTERVAL_IN_MS time to resolve what ever promises it has left to resolve
  setTimeout(() => {
    process.exit(0);
  }, INTERVAL_IN_MS).unref(); // Prevents the timeout from registering on event loop
});

async function main() {
  console.log('-----------------------------------------------------------------------------------------');
  console.group('Main fn');
  try {
    bootstrap();

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
