import {
  HARDWARE_KEY,
  SERIAL_NUMBER,
  CLOUD_ID,
  FIRMWARE_VERSION,
  DEVICE_NAME,
  DEVICE_PROVISIONING_SERVER,
  INITIAL_APP_STATE,
} from './helpers/constants.js';
import { authenticateDeviceFromStorage, setConfigToStorage } from './helpers/storage.js';
import requestAPI from './helpers/network.js';
import { Auth } from './helpers/types';

const REGISTRATION_PAYLOAD = JSON.stringify({
  cloud_id: CLOUD_ID,
  hardware_key: HARDWARE_KEY,
  firmware_version: FIRMWARE_VERSION,
  sn: SERIAL_NUMBER,
  name: DEVICE_NAME,
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

  registrationResponse = await registerDeviceToProvisioningServer(DEVICE_PROVISIONING_SERVER);

  console.log('Device registration response:', registrationResponse);

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
