import {
  HARDWARE_KEY,
  NANO_ID,
  FIRMWARE_VERSION,
  DEVICE_PROVISIONING_SERVER,
  DEVICE_PROVISIONING_PROXY,
} from './helpers/constants.js';
import { updateConfigInStorage, authenticateDeviceFromStorage } from './helpers/storage.js';
import requestAPI from './helpers/network.js';

const REGISTRATION_PAYLOAD = JSON.stringify({
  nano_id: NANO_ID,
  hardware_key: HARDWARE_KEY,
  firmware_version: FIRMWARE_VERSION,
  name: 'Hello world',
});


const registerDeviceToProvisioningServer = async (url: string) => await requestAPI(`${url}/v1/devices`, {
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
    await updateConfigInStorage(registrationResponse);
  }

  return registrationResponse;
};

const authenticateDevice = async () => {
  try {
    // Check if device was already registered
    const storedSettings = authenticateDeviceFromStorage();

    if (Boolean(storedSettings)) {
      console.log('Device already registered - using existing credentials');

      return storedSettings;
    }
    return registerDevice();
    
  } catch (registrationError) {
    console.error('Get authentication info failed', registrationError);

    return null;
  } 
};

export default authenticateDevice;
