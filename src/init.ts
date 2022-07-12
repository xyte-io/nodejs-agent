import main from './main.js';

// Handling termination requests:
// Other events you might find useful: uncaughtException, unhandledRejection, SIGINT
process.on('SIGTERM', () => {
  console.log(`Process ${process.pid} received a SIGTERM signal`);
});

// Main entry point
(async () => {
  console.log('Starting Xyte demo agent');

  await main();
})();
