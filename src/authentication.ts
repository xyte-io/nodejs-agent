import { MODEL_ID, PARTNER_KEY, MAC, SERIAL, FIRMWARE_VERSION, XYTE_SERVER } from './helpers/constants.js';
import { updateStorage, authenticateDeviceFromStorage } from './helpers/storage.js';
import requestAPI from './helpers/network.js';

const REGISTRATION_PAYLOAD = JSON.stringify({
  mac: MAC,
  sn: SERIAL,
  model_id: MODEL_ID,
  partner_key: PARTNER_KEY,
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
  const registrationResponse = await requestAPI(`${XYTE_SERVER}/v1/devices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': `${REGISTRATION_PAYLOAD.length}`,
    },
    body: REGISTRATION_PAYLOAD,
  });

  console.log('* Register device: device registration response:', registrationResponse);

  console.log('* Register device: attempting to save registration response (to storage)');
  await updateStorage(registrationResponse);

  return registrationResponse;
};

const authenticateDevice = async () => {
  try {
    return authenticateDeviceFromStorage(); // retrieved settings from storage and check if device already registered
  } catch (storedAuthError) {
    console.error('* AuthenticateDevice fn: validation (from storage) of device FAILED', storedAuthError);

    try {
      console.log('* AuthenticateDevice fn: attempting (new) device registration');

      return registerDevice(); // attempt to register device with Xyte's servers
    } catch (registrationError) {
      console.error('* AuthenticateDevice fn: validation (via network) of device FAILED', registrationError);

      return null;
    }
  }
};

export default authenticateDevice;
