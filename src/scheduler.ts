import { getTelemetry } from './todo.js';
import { mqttClient } from './helpers/mqtt.js';
import { INTERVAL_IN_MS } from './helpers/constants.js';

/*
  This function runs every INTERVAL_IN_MS milliseconds and updates the server with the latest telemetry
*/
const notifyServerLoop = async () => {
  // 1. Updates the server with the latest telemetry and use the response from Xyte's servers for the next steps
  const telemetryPayload = JSON.stringify(await getTelemetry());

  if (!applicationState.auth) {
    throw new Error('Authentication failed');
  }

  console.log('Sending telemetry to server: ', telemetryPayload);

  mqttClient.client?.publish(
    `v1/device/${applicationState.auth?.id}/telemetry`,
    JSON.stringify(telemetryPayload),
    { qos: 1 },
    (error) => {
      console.log(error);
    }
  );

  // finally restart the routine (in 10s)
  setTimeout(async () => await notifyServerLoop(), INTERVAL_IN_MS);
};

export default notifyServerLoop;
