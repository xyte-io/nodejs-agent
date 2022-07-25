import { getTelemetry } from './todo.js';
import { mqttClient } from './helpers/mqtt.js';
import { INTERVAL_IN_MS } from './helpers/constants.js';

/*
  This function runs every INTERVAL_IN_MS milliseconds and updates the server with the latest telemetry
*/
const notifyServerLoop = async () => {
  // 1. Updates the server with the latest telemetry and use the response from Xyte's servers for the next steps
  const telemetryPayload = await getTelemetry();

  if (!applicationState.auth) {
    throw new Error('Authentication failed');
  }

  console.log('Sending telemetry to server: ', telemetryPayload);

  mqttClient.publish({
    topic: `v1/device/${applicationState.auth?.id}/telemetry`,
    payload: telemetryPayload,
  });

  // finally restart the routine (in 10s)
  setTimeout(async () => await notifyServerLoop(), INTERVAL_IN_MS);
};

export default notifyServerLoop;
