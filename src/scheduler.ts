import { getTelemetry, handleCommand } from './todo.js';
import evaluateConfigVersion from './config.js';
import handleLicense from './licenses.js';
import requestAPI from './helpers/network.js';
import { INTERVAL_IN_MS, XYTE_SERVER } from './helpers/constants.js';

/*
  This function runs every INTERVAL_IN_MS milliseconds and:
    1. Updates the server with the latest telemetry and uses the response from Xyte's servers for the next steps
    2. Checks if the server has updated configuration, and if so, update it
    3. Checks if there are pending commands, and if so, attempt to perform them
    4. Checks if there are any license changes required
*/
const notifyServerLoop = async (deviceId: string, accessKey: string) => {
  console.log();
  console.group('NotifyServerLoop fn');
  // 1. Updates the server with the latest telemetry and use the response from Xyte's servers for the next steps
  const telemetryPayload = JSON.stringify(await getTelemetry());
  const {
    config_version: configVersion,
    command: commandFlag,
    new_licenses: newLicenses,
  } = await requestAPI(`${XYTE_SERVER}/v1/devices/${deviceId}/telemetry`, {
    method: 'POST',
    headers: {
      'Authorization': accessKey,
      'Content-Type': 'application/json',
      'Content-Length': `${telemetryPayload.length}`,
    },
    body: telemetryPayload,
  });

  // 2. Checks if the server has updated configuration, and if so, update it
  await evaluateConfigVersion(deviceId, accessKey, configVersion);

  // 3. Checks if there are pending commands, and if so, attempt to perform them
  if (Boolean(commandFlag)) {
    // a. query the server for the command
    const command = await requestAPI(`${XYTE_SERVER}/v1/devices/${deviceId}/command`, {
      method: 'GET',
      headers: {
        'Authorization': accessKey,
        'Content-Type': 'application/json',
      },
    });

    // b. Perform the command on the device
    await handleCommand(command);

    // c. Update the server of the command execution status (done / in_progress / failed)
    const commandStatusPayload = JSON.stringify({
      status: 'done', // other possible values are: `in_progress`, `failed`
      message: 'Not important', // a message to describe `failed` status error
    });

    await requestAPI(`${XYTE_SERVER}/v1/devices/${deviceId}/command`, {
      method: 'POST',
      headers: {
        'Authorization': accessKey,
        'Content-Type': 'application/json',
        'Content-Length': `${commandStatusPayload.length}`,
      },
      body: commandStatusPayload,
    });
  }

  // 4. Checks if there are any license changes required
  if (Boolean(newLicenses)) {
    const licenses = await requestAPI(`${XYTE_SERVER}/v1/devices/${deviceId}/licenses`, {
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
  console.groupEnd();

  // finally restart the routine (in 10s)
  setTimeout(async () => await notifyServerLoop(deviceId, accessKey), INTERVAL_IN_MS);
};

export default notifyServerLoop;
