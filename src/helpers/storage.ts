import * as fs from 'fs';
import path from 'path';
import { CONFIG_FILE_NAME, TURNED_OFF_FILE_NAME, TURNED_ON_FILE_NAME } from './constants.js';

/* this is a mechanism to track graceful terminations */
export const bootstrap = () => {
  console.group('bootstrap fn');
  console.log('Attempting to read & write bootstrap file to storage');

  const hasStarted = fs.existsSync(path.resolve(TURNED_ON_FILE_NAME));
  const hasGracefulShutdown = fs.existsSync(path.resolve(TURNED_OFF_FILE_NAME));

  try {
    console.log('Attempting to delete old bootstrap files');

    if (hasStarted) {
      fs.unlinkSync(path.resolve(TURNED_ON_FILE_NAME));
    }
    if (hasGracefulShutdown) {
      fs.unlinkSync(path.resolve(TURNED_OFF_FILE_NAME));
    }
  } catch (error) {
    console.log('ERROR deleting old bootstrap files');
    console.error(error);
  } finally {
    fs.writeFileSync(path.resolve(TURNED_ON_FILE_NAME), '', 'ascii');
    console.groupEnd();
  }
};

// Read config JSON data from file
export const readConfigFromStorage = () => {
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

// Replace config JSON data in file
export const setConfigToStorage = (payload: any) => {
  console.group('SetStorage fn');
  console.log('Attempting to write config file to storage');

  fs.writeFileSync(path.resolve(CONFIG_FILE_NAME), JSON.stringify(payload), 'ascii');
  console.groupEnd();
};

// Merge config JSON data with one saved in the file
export const updateConfigInStorage = async (payload: Record<string, any>) => {
  console.group('UpdateStorage fn');
  console.log('Attempting to update config file');

  setConfigToStorage({ ...readConfigFromStorage(), ...payload });
  console.groupEnd();
};

/* Succeed if stored data has an 'id' property, return an error otherwise */
export const authenticateDeviceFromStorage = () => {
  console.group('AuthenticateDeviceFromStorage fn');
  console.log('Attempting to retrieve config file from storage');
  const storedSettings = readConfigFromStorage();

  if (Boolean(storedSettings) && Boolean(storedSettings.id)) {
    console.log('Retrieved config file from storage');

    console.groupEnd();
    return storedSettings;
  }
  console.groupEnd();
};
