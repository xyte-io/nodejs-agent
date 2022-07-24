import main from './main.js';
import { mqttClient } from './helpers/mqtt.js';

// Handling termination requests:
// Other events you might find useful: uncaughtException, unhandledRejection, SIGINT
process.on('SIGTERM', () => {
  console.log(`Process ${process.pid} received a SIGTERM signal`);
  mqttClient.client?.end();
});

// Main entry point
(async () => {
  console.log('Starting Xyte demo agent');

  await main();
})();
