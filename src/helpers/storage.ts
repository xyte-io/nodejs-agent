import * as fs from 'fs';
import path from 'path';
import { CONFIG_FILE_NAME } from './constants.js';

// Read JSON data from file
export const readStorage = () => {
  console.group('ReadStorage fn');
  const storage =
    fs.existsSync(path.resolve(CONFIG_FILE_NAME)) &&
    JSON.parse(fs.readFileSync(path.resolve(CONFIG_FILE_NAME), 'ascii'));

  if (Boolean(storage)) {
    console.log('found something in storage');

    console.groupEnd();
    return storage;
  }
  console.groupEnd();
};

// Replace JSON data in file
export const setStorage = (payload: any) => {
  console.group('SetStorage fn');
  console.log('Attempting to write config file to storage');

  fs.writeFileSync(path.resolve(CONFIG_FILE_NAME), JSON.stringify(payload), 'ascii');
  console.groupEnd();
};

// Merge JSON data with one saved in the file
export const updateStorage = async (payload: Record<string, any>) => {
  console.group('UpdateStorage fn');
  console.log('Attempting to update config file');

  setStorage({ ...readStorage(), ...payload });
  console.groupEnd();
};

/* Succeed if stored data has an 'id' property, return an error otherwise */
export const authenticateDeviceFromStorage = () => {
  console.group('AuthenticateDeviceFromStorage fn');
  console.log('Attempting to retrieve config file from storage');
  const storedSettings = readStorage();

  if (Boolean(storedSettings) && Boolean(storedSettings.id)) {
    console.log('Retrieved config file from storage');

    console.groupEnd();
    return storedSettings;
  }
  console.groupEnd();
};
