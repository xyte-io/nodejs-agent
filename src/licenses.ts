import { applyLicense, removeLicense } from './todo.js';
import { setConfigToStorage } from './helpers/storage.js';
import { License } from './helpers/types';
import { mqttClient } from './helpers/mqtt.js';

export const isLicenseMessage = (topic: string) => /^v1\/device\/.*\/license$/.test(topic);

export const onLicenseCommand = async (license: License, responseTopic: string) => {
  const { add, remove, update, ...licenseWithoutStatus } = license;
  if (add) {
    await handleAddLicense(licenseWithoutStatus, responseTopic);
  }

  if (remove) {
    await handleRemoveLicense(licenseWithoutStatus, responseTopic);
  }
};

// License addition has 3 steps:
// 1. Enable relevant features on the device
// 2. Add to stored licenses list
// 3. Notify server license was activated
const handleAddLicense = async (license: License, responseTopic: string) => {
  console.group('HandleAddLicense fn');

  await applyLicense(license);

  applicationState.licenses = [...applicationState.licenses, license];
  setConfigToStorage({ ...applicationState, licenses: [...applicationState.licenses, license] });

  // Update the server on the state of the license
  const licensePayload = JSON.stringify({
    id: license.id,
    state: 'inuse',
  });

  mqttClient.publish({
    topic: responseTopic,
    payload: licensePayload,
    correlationData: license.id,
  });

  console.groupEnd();

  return true;
};

// License removal has 3 steps:
// 1. Disable relevant features on the device
// 2. Remove from stored licenses list
// 3. Notify server license was removed
const handleRemoveLicense = async (license: License, responseTopic: string) => {
  console.group('HandleRemoveLicense fn');

  await removeLicense(license);

  const newLicensesList = applicationState.licenses.filter((existingLicence) => existingLicence.id !== license.id);

  applicationState.licenses = newLicensesList;
  setConfigToStorage({ ...applicationState, licenses: newLicensesList });

  // Update the server on the state of the license
  const licensePayload = JSON.stringify({
    id: license.id,
    state: 'removed',
  });

  mqttClient.publish({
    topic: responseTopic,
    payload: licensePayload,
    correlationData: license.id,
  });

  console.groupEnd();

  return true;
};
