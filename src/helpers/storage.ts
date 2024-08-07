import fs from 'fs';
import path from 'path';
import url from 'url';
import { CONFIG_FILE_NAME, ERR_LOG_FILE, FIRMWARE_FILE_NAME, INITIAL_APP_STATE, STD_LOG_FILE, LOG_LEVEL } from './constants.js';
import { State } from './types';

const dirname = Boolean(import.meta.url) ? url.fileURLToPath(new URL('.', import.meta.url)) : __dirname;

export const saveFirmwareToStorage = (payload: unknown) =>
  fs.writeFileSync(path.resolve(dirname, FIRMWARE_FILE_NAME), JSON.stringify(payload), 'ascii');

export const readStdLogFromStorage = () =>
  Boolean(fs.existsSync(path.resolve(dirname, STD_LOG_FILE))) &&
  fs.readFileSync(path.resolve(dirname, STD_LOG_FILE), 'ascii');
export const readErrLogFromStorage = () =>
  Boolean(fs.existsSync(path.resolve(dirname, ERR_LOG_FILE))) &&
  fs.readFileSync(path.resolve(dirname, ERR_LOG_FILE), 'ascii');

/* this is part of a mechanism to track command execution during graceful terminations */
export const clearStorage = () => {
  console.log('Attempting to clear std,err logs from file storage');

  Boolean(fs.existsSync(path.resolve(dirname, CONFIG_FILE_NAME))) &&
    fs.unlinkSync(path.resolve(dirname, CONFIG_FILE_NAME));
  Boolean(fs.existsSync(path.resolve(dirname, FIRMWARE_FILE_NAME))) &&
    fs.unlinkSync(path.resolve(dirname, FIRMWARE_FILE_NAME));
  Boolean(fs.existsSync(path.resolve(dirname, STD_LOG_FILE))) && fs.unlinkSync(path.resolve(dirname, STD_LOG_FILE));
  Boolean(fs.existsSync(path.resolve(dirname, ERR_LOG_FILE))) && fs.unlinkSync(path.resolve(dirname, ERR_LOG_FILE));
};

// Read config JSON data from file
export const readConfigFromStorage = () => {
  const storage =
    Boolean(fs.existsSync(path.resolve(dirname, CONFIG_FILE_NAME))) &&
    JSON.parse(fs.readFileSync(path.resolve(dirname, CONFIG_FILE_NAME), 'ascii'));

  return storage || INITIAL_APP_STATE;
};

// Overwrite config JSON data in file
export const setConfigToStorage = (payload: State) => {
  if (LOG_LEVEL === 'debug') {
    console.log('Save (overwrite) state to local storage');
  }

  fs.writeFileSync(path.resolve(dirname, CONFIG_FILE_NAME), JSON.stringify(payload), 'ascii');
};

/* Succeed if stored data has an 'id' property, return an error otherwise */
export const authenticateDeviceFromStorage = () => {
  const storedConfig = readConfigFromStorage();

  if (LOG_LEVEL === 'debug') {
    console.log('Device authentication data in local storage: ', storedConfig?.auth);
  }

  if (Boolean(storedConfig?.auth?.id)) {
    applicationState = storedConfig;
  }
};
