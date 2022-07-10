import main from './main.js';
import { setShutdownToStorage } from './helpers/storage.js';
import { TURNED_OFF_FILE_NAME } from './helpers/constants.js';

// handling termination requests
// other event you might find useful: uncaughtException, unhandledRejection, SIGINT
process.on('SIGTERM', () => {
  console.group('SIGTERM fn');
  console.log(`Process ${process.pid} received a SIGTERM signal`);
  console.log('Attempting to write graceful shutdown message to', TURNED_OFF_FILE_NAME);

  setShutdownToStorage();

  console.groupEnd();
});

// program starts here:
(async () => {
  console.log('-----------------------------------------------------------------------------------------');
  console.log('Starting Xyte`s agent');
  await main();
})();
