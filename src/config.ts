import { readStorage, setStorage } from './helpers/storage.js';
import { updateConfig } from './todo.js';
import requestAPI from './helpers/network.js';

/*
  Check if the configuration version on the server, is newer than local
  To get local version, read the config object saved locally on this device

 Configuration update has 2 steps
 1. Save it locally
 2. Update the server of the config we saved (we are allowed to make changes if required)

 NOTE: This can be called directly if someone updated the device's configuration locally
 It will result in the local config being mirrored in the server.
*/
const evaluateConfigVersion = async (deviceId: string, accessKey: string, serverVersion: string) => {
  console.group('EvaluateConfigVersion fn');
  const storedConfig = readStorage();

  if (!Boolean(storedConfig)) {
    throw new Error('checkConfigVersion: unable to retrieve version from storage, ');
  }

  const localVersion = (storedConfig.config && storedConfig.config.version) || 0;

  // check if local configuration is outdated
  if (serverVersion > localVersion) {
    // Get the latest configuration from the server
    const newConfig = await requestAPI(`${storedConfig.hub_url}/v1/devices/${deviceId}/config`, {
      method: 'GET',
      headers: {
        'Authorization': accessKey,
        'Content-Type': 'application/json',
      },
    });

    // update device with the new configuration.
    await updateConfig(newConfig);

    // merge the new config with existing settings in device storage
    await setStorage({ ...storedConfig, ...newConfig });

    // Update the server with our current configuration
    await requestAPI(`${storedConfig.hub_url}/v1/devices/${deviceId}/config`, {
      method: 'POST',
      headers: {
        'Authorization': accessKey,
        'Content-Type': 'application/json',
        'Content-Length': `${JSON.stringify(newConfig).length}`,
      },
      body: JSON.stringify(newConfig),
    });
  }

  console.groupEnd();
};

export default evaluateConfigVersion;
