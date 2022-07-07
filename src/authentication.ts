import { HARDWARE_KEY, NANO_ID, FIRMWARE_VERSION, DEVICE_REGISTRATION_SERVER } from './helpers/constants.js';
import { updateConfigInStorage, authenticateDeviceFromStorage } from './helpers/storage.js';
import requestAPI from './helpers/network.js';

const REGISTRATION_PAYLOAD = JSON.stringify({
  nano_id: NANO_ID,
  hardware_key: HARDWARE_KEY,
  firmware_version: FIRMWARE_VERSION,
  name: 'Hello world',
});

/*
  Ask the server to register a device
  Calling the register method returns the id + access key
  This auth information must be saved for later use with all API requests
  Registration can only be done once for each device! (Mac + Serial number)
 */
const registerDevice = async () => {
  console.group('RegisterDevice fn');
  const registrationResponse = await requestAPI(`${DEVICE_REGISTRATION_SERVER}/v1/devices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': `${REGISTRATION_PAYLOAD.length}`,
    },
    body: REGISTRATION_PAYLOAD,
  });
  console.log('device registration response:', registrationResponse);

  if (Boolean(registrationResponse) && Boolean(registrationResponse.id)) {
    console.log('attempting to save registration response (to storage)');
    await updateConfigInStorage(registrationResponse);

    console.groupEnd();
    return registrationResponse;
  }

  console.groupEnd();
  return null;
};

const authenticateDevice = async () => {
  console.group('AuthenticateDevice fn');
  try {
    // retrieved settings from storage and check if device already registered
    const storedSettings = authenticateDeviceFromStorage();

    if (Boolean(storedSettings)) {
      console.log('validation (from storage) of device SUCCESS');

      return storedSettings;
    }
    console.error('validation (from storage) of device FAILED');

    return registerDevice();
  } catch (registrationError) {
    console.error('validation (via storage & via network) of device FAILED', registrationError);

    return null;
  } finally {
    console.groupEnd();
  }
};

export default authenticateDevice;
