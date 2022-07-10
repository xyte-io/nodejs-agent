import { getTelemetry } from './todo.js';
import evaluateConfigVersion from './config.js';
import handleCommand from './command.js';
import handleLicense from './licenses.js';
import requestAPI from './helpers/network.js';
import { INTERVAL_IN_MS } from './helpers/constants.js';

/*
  This function runs every INTERVAL_IN_MS milliseconds and:
    1. Updates the server with the latest telemetry and uses the response from Xyte's servers for the next steps
    2. Checks if the server has updated configuration, and if so, update it
    3. Checks if there are pending commands, and if so, attempt to perform them
    4. Checks if there are any license changes required
*/
const notifyServerLoop = async (authData: any) => {
  const { id: deviceId, access_key: accessKey, hub_url } = authData;

  // 1. Updates the server with the latest telemetry and use the response from Xyte's servers for the next steps
  const telemetryPayload = JSON.stringify(await getTelemetry());
  
  console.log('Sending telemetry to server: ', telemetryPayload);

  const telemetryResponse = await requestAPI(`${hub_url}/v1/devices/${deviceId}/telemetry`, {
    method: 'POST',
    headers: {
      'Authorization': accessKey,
      'Content-Type': 'application/json',
      'Content-Length': `${telemetryPayload.length}`
    },
    body: telemetryPayload
  });

  const {
    config_version: configVersion,
    command: commandFlag,
    new_licenses: newLicenses
  } = telemetryResponse;
  
  // 2. Checks if the server has updated configuration, and if so, update it
  await evaluateConfigVersion(authData, configVersion);

  // 3. Checks if there are pending commands, and if so, attempt to perform them
  if (Boolean(commandFlag)) {
    // a. query the server for the command
    const command = await requestAPI(`${hub_url}/v1/devices/${deviceId}/command`, {
      method: 'GET',
      headers: {
        'Authorization': accessKey,
        'Content-Type': 'application/json',
      },
    });

    // b. Perform the command on the device
    await handleCommand(authData, command);
  }

  // 4. Checks if there are any license changes required
  if (Boolean(newLicenses)) {
    const licenses = await requestAPI(`${authData.hub_url}/v1/devices/${deviceId}/licenses`, {
      method: 'GET',
      headers: {
        'Authorization': accessKey,
        'Content-Type': 'application/json',
      },
    });

    /*
      The following code makes sure each license update is done one after the other.
      Only once a license is applied/removed, the next one will be handled sequentially
      In order to avoid potential concurrency issues.
    */
    for (const license of licenses) {
      await handleLicense(deviceId, accessKey, license);
    }
  }

  // finally restart the routine (in 10s)
  setTimeout(async () => await notifyServerLoop(authData), INTERVAL_IN_MS);
};

export default notifyServerLoop;
