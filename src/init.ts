import main from './main.js';
import { setShutdownToStorage } from './helpers/storage.js';
import { TURNED_OFF_FILE_NAME } from './helpers/constants.js';

// Handling termination requests:
// Other events you might find useful: uncaughtException, unhandledRejection, SIGINT
process.on('SIGTERM', () => {
  console.log(`Process ${process.pid} received a SIGTERM signal`);
  setShutdownToStorage();
});

// Main entry point
(async () => {
  console.log('Starting Xyte demo agent');

  await main();
})();
