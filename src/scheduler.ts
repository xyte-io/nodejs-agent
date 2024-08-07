import { getTelemetry } from './todo.js';
import evaluateConfigVersion from './config.js';
import handleCommand from './command.js';
import handleLicenses from './licenses.js';
import requestAPI from './helpers/network.js';
import { INTERVAL_IN_MS } from './helpers/constants.js';

/*
  This function runs every INTERVAL_IN_MS milliseconds and:
    1. Updates the server with the latest telemetry and uses the response from Xyte's servers for the next steps
    2. Checks if the server has updated configuration, and if so, update it
    3. Checks if there are pending commands, and if so, attempt to perform them
    4. Checks if there are any license changes required
*/
const notifyServerLoop = async () => {
  console.log('\n');

  // 1. Updates the server with the latest telemetry and use the response from Xyte's servers for the next steps
  const telemetryPayload = JSON.stringify(await getTelemetry());

  if (!applicationState.auth) {
    throw new Error('Authentication failed');
  }

  console.log('Sending telemetry to server: ', telemetryPayload);

  const telemetryResponse = await requestAPI(
    `${applicationState.auth?.hub_url}/v1/devices/${applicationState.auth?.id}/telemetry`,
    {
      method: 'POST',
      headers: {
        'Authorization': applicationState.auth?.access_key,
        'Content-Type': 'application/json',
        'Content-Length': `${telemetryPayload.length}`,
      },
      body: telemetryPayload,
    }
  );

  const { config_version: configVersion, command: commandFlag, new_licenses: newLicenses } = telemetryResponse;

  // 2. Checks if the server has updated configuration, and if so, update it
  await evaluateConfigVersion(configVersion);

  // 3. Checks if there are pending commands, and if so, attempt to perform them
  if (Boolean(commandFlag)) {
    await handleCommand();
  }

  // 4. Checks if there are any license changes required
  if (Boolean(newLicenses)) {
    await handleLicenses();
  }

  // finally restart the routine (in 10s)
  setTimeout(async () => await notifyServerLoop(), INTERVAL_IN_MS);
};

export default notifyServerLoop;
