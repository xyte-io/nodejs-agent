import fs from 'fs';
import path from 'path';
import { CONFIG_FILE_NAME, ERR_LOG_FILE, FIRMWARE_FILE_NAME, INITIAL_APP_STATE, STD_LOG_FILE } from './constants.js';
import { State } from './types';

export const saveFirmwareToStorage = (payload: any) =>
  fs.writeFileSync(path.resolve(FIRMWARE_FILE_NAME), JSON.stringify(payload), 'ascii');

export const readStdLogFromStorage = () =>
  Boolean(fs.existsSync(path.resolve(STD_LOG_FILE))) && fs.readFileSync(path.resolve(STD_LOG_FILE), 'ascii');
export const readErrLogFromStorage = () =>
  Boolean(fs.existsSync(path.resolve(ERR_LOG_FILE))) && fs.readFileSync(path.resolve(ERR_LOG_FILE), 'ascii');

/* this is part of a mechanism to track command execution during graceful terminations */
export const clearStorage = () => {
  console.log('Attempting to clear std,err logs from file storage');

  Boolean(fs.existsSync(path.resolve(CONFIG_FILE_NAME))) && fs.unlinkSync(path.resolve(CONFIG_FILE_NAME));
  Boolean(fs.existsSync(path.resolve(FIRMWARE_FILE_NAME))) && fs.unlinkSync(path.resolve(FIRMWARE_FILE_NAME));
  Boolean(fs.existsSync(path.resolve(STD_LOG_FILE))) && fs.unlinkSync(path.resolve(STD_LOG_FILE));
  Boolean(fs.existsSync(path.resolve(ERR_LOG_FILE))) && fs.unlinkSync(path.resolve(ERR_LOG_FILE));
};

// Read config JSON data from file
export const readConfigFromStorage = () => {
  const storage =
    Boolean(fs.existsSync(path.resolve(CONFIG_FILE_NAME))) &&
    JSON.parse(fs.readFileSync(path.resolve(CONFIG_FILE_NAME), 'ascii'));

  return storage || INITIAL_APP_STATE;
};

// Overwrite config JSON data in file
export const setConfigToStorage = (payload: State) => {
  console.log('Save (overwrite) state to local storage');

  fs.writeFileSync(path.resolve(CONFIG_FILE_NAME), JSON.stringify(payload), 'ascii');
};

/* Succeed if stored data has an 'id' property, return an error otherwise */
export const authenticateDeviceFromStorage = () => {
  const storedConfig = readConfigFromStorage();

  console.log('Get device authentication data: ', storedConfig?.auth);

  if (Boolean(storedConfig?.auth?.id)) {
    applicationState = storedConfig;
  }
};
