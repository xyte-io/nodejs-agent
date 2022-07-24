import { updateConfig } from './todo.js';
import { setConfigToStorage } from './helpers/storage.js';
import requestAPI from './helpers/network.js';
import { Config } from './helpers/types';

/*
  Compare the server's configuration version to the one we have locally, if the server's is higher - update the local configuration.

  Configuration update has 2 steps
  1. Save it locally
  2. Update the server of the config we saved (we are allowed to make changes if required)

  NOTE: This can be called directly if someone updated the device's configuration locally
        It will result in the local config being mirrored in the server.
*/
const evaluateConfigVersion = async (serverVersion = 0) => {
  const localVersion = applicationState.config?.version || 0;

  if (serverVersion <= localVersion) {
    return;
  }

  // Get the latest configuration from the server
  const newConfig: Config = await requestAPI(
    `${applicationState.auth?.hub_url}/v1/devices/${applicationState.auth?.id}/config`,
    {
      method: 'GET',
      headers: {
        'Authorization': applicationState.auth?.access_key,
        'Content-Type': 'application/json',
      },
    }
  );

  // Update device with the new configuration.
  await updateConfig(newConfig);
  applicationState.config = newConfig;
  // Merge the new config with existing settings in device storage
  setConfigToStorage({ ...applicationState, config: newConfig });

  // Update the server with our current configuration
  await requestAPI(`${applicationState.auth?.hub_url}/v1/devices/${applicationState.auth?.id}/config`, {
    method: 'POST',
    headers: {
      'Authorization': applicationState.auth?.access_key,
      'Content-Type': 'application/json',
      'Content-Length': `${JSON.stringify(newConfig).length}`,
    },
    body: JSON.stringify(newConfig),
  });
};

export default evaluateConfigVersion;
