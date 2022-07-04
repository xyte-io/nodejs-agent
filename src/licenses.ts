import { readConfigFromStorage, setConfigToStorage } from './helpers/storage.js';
import { applyLicense, removeLicense } from './todo.js';
import requestAPI from './helpers/network.js';

// License addition has 3 steps:
// 1. Enable relevant features on the device
// 2. Add to stored licenses list
// 3. Notify server license was activated
const handleAddLicense = async (deviceId: string, accessKey: string, license: Record<string, any>) => {
  console.group('HandleAddLicense fn');

  await applyLicense(license);

  const config = readConfigFromStorage();
  await setConfigToStorage({ ...config, licenses: [...((config && config.licenses) || []), license] });

  // Update the server on the state of the license
  const licensePayload = JSON.stringify({
    id: license.id,
    state: 'inuse',
  });

  await requestAPI(`${config.hub_url}/v1/devices/${deviceId}/licenses`, {
    method: 'POST',
    headers: {
      'Authorization': accessKey,
      'Content-Type': 'application/json',
      'Content-Length': `${licensePayload.length}`,
    },
    body: licensePayload,
  });
  console.groupEnd();

  return true;
};

// License removal has 3 steps:
// 1. Disable relevant features on the device
// 2. Remove from stored licenses list
// 3. Notify server license was removed
const handleRemoveLicense = async (deviceId: string, accessKey: string, license: Record<string, any>) => {
  console.group('HandleRemoveLicense fn');

  await removeLicense(license);

  const config = readConfigFromStorage();
  const newLicensesList = ((config && config.licenses) || []).filter((item: typeof license) => item.id !== license.id);

  await setConfigToStorage({ ...config, licenses: newLicensesList });

  // Update the server on the state of the license
  const licensePayload = JSON.stringify({
    id: license.id,
    state: 'removed',
  });

  await requestAPI(`${config.hub_url}/v1/devices/${deviceId}/licenses`, {
    method: 'POST',
    headers: {
      'Authorization': accessKey,
      'Content-Type': 'application/json',
      'Content-Length': `${licensePayload.length}`,
    },
    body: licensePayload,
  });
  console.groupEnd();

  return true;
};

// For each license, check if it is marked to be added or removed
const handleLicense = async (deviceId: string, accessKey: string, license: Record<string, any>) => {
  console.group('HandleLicense fn');
  if (Boolean(license.add)) {
    const hasAdded = await handleAddLicense(deviceId, accessKey, license);

    if (hasAdded) {
      delete license['add'];
    }
  } else if (Boolean(license.remove)) {
    const hasDeleted = await handleRemoveLicense(deviceId, accessKey, license);

    if (hasDeleted) {
      delete license['remove'];
    }
  }
  console.groupEnd();
};

export default handleLicense;
