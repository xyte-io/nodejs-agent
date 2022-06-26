import fs from 'node:fs';
import { CONFIG_FILE_NAME } from './constants';

// Read JSON data from file
export const readStorage = () => {
  const storage = JSON.parse(fs.readFileSync(CONFIG_FILE_NAME, 'ascii'));

  if (Boolean(storage)) {
    console.log('* Read storage: found something in storage');

    return storage;
  }
};

// Replace JSON data in file
export const setStorage = (payload: any) => {
  fs.writeFileSync(CONFIG_FILE_NAME, JSON.stringify(payload), 'ascii');
};

// Merge JSON data with one saved in the file
export const updateStorage = async (payload: Record<string, any>) => {
  const storedPayload = readStorage();
  setStorage({ ...storedPayload, ...payload });
};

/* Succeed if stored data has an 'id' property, return an error otherwise */
export const authenticateDeviceFromStorage = () => {
  const storedSettings = readStorage();

  if (Boolean(storedSettings.id)) {
    console.log('* Register device: retrieved settings from storage');

    return storedSettings;
  }
};
