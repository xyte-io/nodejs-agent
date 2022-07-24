import { updateConfig } from './todo.js';
import { setConfigToStorage } from './helpers/storage.js';
import { Config } from './helpers/types';
import { mqttClient } from './helpers/mqtt.js';

export const isConfigMessage = (topic: string) => /v1\/device\/.*\/config/.test(topic);

/*
  Compare the server's configuration version to the one we have locally, if the server's is higher - update the local configuration.

  Configuration update has 2 steps
  1. Save it locally
  2. Update the server of the config we saved (we are allowed to make changes if required)

  NOTE: This can be called directly if someone updated the device's configuration locally
        It will result in the local config being mirrored in the server.
*/
export const onConfigMessage = async (newConfig: Config, responseTopic: string) => {
  const localVersion = applicationState.config?.version || 0;

  if (newConfig!.version <= localVersion) {
    return;
  }

  // Update device with the new configuration.
  await updateConfig(newConfig);
  applicationState.config = newConfig;

  // Merge the new config with existing settings in device storage
  setConfigToStorage({ ...applicationState, config: newConfig });

  mqttClient.publish({
    topic: responseTopic,
    payload: newConfig,
    correlationData: newConfig,
  });
};
