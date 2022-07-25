import { applyLicense, removeLicense } from './todo.js';
import { setConfigToStorage } from './helpers/storage.js';
import requestAPI from './helpers/network.js';
import { License } from './helpers/types';

// License addition has 3 steps:
// 1. Enable relevant features on the device
// 2. Add to stored licenses list
// 3. Notify server license was activated
const handleAddLicense = async (license: License) => {
  console.group('HandleAddLicense fn');

  await applyLicense(license);

  applicationState.licenses = [...applicationState.licenses, license];
  setConfigToStorage({ ...applicationState, licenses: [...applicationState.licenses, license] });

  // Update the server on the state of the license
  const licensePayload = JSON.stringify({
    id: license.id,
    state: 'inuse',
  });

  await requestAPI(`${applicationState.auth?.hub_url}/v1/devices/${applicationState.auth?.id}/licenses`, {
    method: 'POST',
    headers: {
      'Authorization': applicationState.auth?.access_key,
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
const handleRemoveLicense = async (license: License) => {
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

  await requestAPI(`${applicationState.auth?.hub_url}/v1/devices/${applicationState.auth?.id}/licenses`, {
    method: 'POST',
    headers: {
      'Authorization': applicationState.auth?.access_key,
      'Content-Type': 'application/json',
      'Content-Length': `${licensePayload.length}`,
    },
    body: licensePayload,
  });
  console.groupEnd();

  return true;
};

// For each license, check if it is marked to be added or removed
const handleLicense = async (license: License) => {
  console.group('HandleLicense fn');
  if (Boolean(license.add)) {
    const hasAdded = await handleAddLicense(license);

    if (hasAdded) {
      delete license['add'];
    }
  } else if (Boolean(license.remove)) {
    const hasDeleted = await handleRemoveLicense(license);

    if (hasDeleted) {
      delete license['remove'];
    }
  }
  console.groupEnd();
};

const handleLicenses = async () => {
  const licenses = await requestAPI(
    `${applicationState.auth?.hub_url}/v1/devices/${applicationState.auth?.id}/licenses`,
    {
      method: 'GET',
      headers: {
        'Authorization': applicationState.auth?.access_key,
        'Content-Type': 'application/json',
      },
    }
  );

  /*
    The following code makes sure each license update is done one after the other.
    Only once a license is applied/removed, the next one will be handled sequentially
    In order to avoid potential concurrency issues.
  */
  for (const license of licenses) {
    await handleLicense(license);
  }
};

export default handleLicenses;
