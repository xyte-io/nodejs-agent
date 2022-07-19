import {
  HARDWARE_KEY,
  NANO_ID,
  FIRMWARE_VERSION,
  DEVICE_NAME,
  DEVICE_PROVISIONING_SERVER,
  DEVICE_PROVISIONING_PROXY,
  INITIAL_APP_STATE,
} from './helpers/constants.js';
import { authenticateDeviceFromStorage, setConfigToStorage } from './helpers/storage.js';
import requestAPI from './helpers/network.js';
import { Auth } from './helpers/types';

const REGISTRATION_PAYLOAD = JSON.stringify({
  nano_id: NANO_ID, // TODO: retrieve real value from xyte app
  hardware_key: HARDWARE_KEY, // TODO: generate a real nano id
  firmware_version: FIRMWARE_VERSION, // TODO: use a real firmware version
  name: DEVICE_NAME, // TODO: use a real name
});

const registerDeviceToProvisioningServer = async (url: string): Promise<Auth> =>
  await requestAPI(`${url}/v1/devices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': `${REGISTRATION_PAYLOAD.length}`,
    },
    body: REGISTRATION_PAYLOAD,
  });

/*
  Ask the server to register a device
  Calling the register method returns the id + access key
  This auth information must be saved for later use with all API requests
  Registration can only be done once for each device! (Mac + Serial number)
 */
const registerDevice = async () => {
  console.log('Register device');

  let registrationResponse = null;

  try {
    registrationResponse = await registerDeviceToProvisioningServer(DEVICE_PROVISIONING_SERVER);
  } catch (error) {
    registrationResponse = await registerDeviceToProvisioningServer(DEVICE_PROVISIONING_PROXY);
  }

  console.log('device registration response:', registrationResponse);

  if (Boolean(registrationResponse?.id)) {
    applicationState = { ...INITIAL_APP_STATE, auth: registrationResponse };
    setConfigToStorage({ ...INITIAL_APP_STATE, auth: registrationResponse });
  }
};

const authenticateDevice = async () => {
  try {
    // Check if device was already registered
    authenticateDeviceFromStorage();

    if (!applicationState.auth) {
      await registerDevice();
    }
  } catch (registrationError) {
    console.error(registrationError);
    throw new Error('Authentication failed');
  }
};

export default authenticateDevice;
