import authenticateDevice from './authentication.js';
import notifyServerLoop from './scheduler.js';
import { INITIAL_APP_STATE, INTERVAL_IN_MS } from './helpers/constants.js';
import { mqttClient } from './helpers/mqtt.js';
import { listenToMessages } from './mqtt-subscriber.js';

global.applicationState = INITIAL_APP_STATE;

async function main() {
  try {
    await authenticateDevice();

    if (!applicationState.auth) {
      throw new Error('Authentication failed');
    }

    mqttClient.connect(applicationState.auth.mqtt_hub_url, applicationState.auth.id, applicationState.auth.access_key);
    listenToMessages();

    await notifyServerLoop();
  } catch (error) {
    console.error(`Restarting main loop due to (${error}) Restarting in: ${INTERVAL_IN_MS}`);

    setTimeout(async () => await main(), INTERVAL_IN_MS);
  }
}

export default main;
