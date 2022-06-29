import * as fs from 'fs';
import path from 'path';
import { CONFIG_FILE_NAME } from './constants.js';

// Read JSON data from file
export const readStorage = () => {
  console.log('- ReadStorage fn - START');
  const storage =
    fs.existsSync(path.resolve(CONFIG_FILE_NAME)) &&
    JSON.parse(fs.readFileSync(path.resolve(CONFIG_FILE_NAME), 'ascii'));

  if (Boolean(storage)) {
    console.log('* Read storage: found something in storage');

    return storage;
  }
};

// Replace JSON data in file
export const setStorage = (payload: any) =>
  // @ts-ignore TS1345: An expression of type 'void' cannot be tested for truthiness.
  console.log('- SetStorage fn - START') &&
  fs.writeFileSync(path.resolve(CONFIG_FILE_NAME), JSON.stringify(payload), 'ascii');

// Merge JSON data with one saved in the file
export const updateStorage = async (payload: Record<string, any>) =>
  // @ts-ignore TS1345: An expression of type 'void' cannot be tested for truthiness.
  console.log('- UpdateStorage fn - START') && setStorage({ ...readStorage(), ...payload });

/* Succeed if stored data has an 'id' property, return an error otherwise */
export const authenticateDeviceFromStorage = () => {
  console.log('- AuthenticateDeviceFromStorage fn - START');
  const storedSettings = readStorage();

  if (Boolean(storedSettings) && Boolean(storedSettings.id)) {
    console.log('* Register device: retrieved settings from storage');

    return storedSettings;
  }
};
