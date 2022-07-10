import fs from 'fs';
import path from 'path';
import {
  COMMAND_FILE_NAME,
  CONFIG_FILE_NAME,
  ERR_LOG_FILE,
  FIRMWARE_FILE_NAME,
  STD_LOG_FILE,
  TURNED_OFF_FILE_NAME,
} from './constants.js';

/* this is a mechanism to track graceful terminations */
export const setShutdownToStorage = () => fs.writeFileSync(path.resolve(TURNED_OFF_FILE_NAME), '', 'ascii');
export const removeShutdownFromStorage = () => fs.unlinkSync(path.resolve(TURNED_OFF_FILE_NAME));
export const hasGracefulShutdown = () => Boolean(fs.existsSync(path.resolve(TURNED_OFF_FILE_NAME)));

export const setFirmwareToStorage = (payload: any) =>
  fs.writeFileSync(path.resolve(FIRMWARE_FILE_NAME), JSON.stringify(payload), 'ascii');

export const readStdLogFromStorage = () =>
  Boolean(fs.existsSync(path.resolve(STD_LOG_FILE))) && fs.readFileSync(path.resolve(STD_LOG_FILE), 'ascii');
export const readErrLogFromStorage = () =>
  Boolean(fs.existsSync(path.resolve(ERR_LOG_FILE))) && fs.readFileSync(path.resolve(ERR_LOG_FILE), 'ascii');

/* this is part of a mechanism to track command execution during graceful terminations */
export const logCommandToStorage = (commandInfo: any) => {
  console.group('logCommandToStorage fn');
  console.log('Attempting to log command info to file storage');

  fs.writeFileSync(path.resolve(COMMAND_FILE_NAME), JSON.stringify(commandInfo), 'ascii');

  console.groupEnd();
};

/* this is part of a mechanism to track command execution during graceful terminations */
export const clearCommandLogFromStorage = () => {
  console.group('clearCommandLogFromStorage fn');
  console.log('Attempting to clear log command from file storage');

  Boolean(fs.existsSync(path.resolve(COMMAND_FILE_NAME))) && fs.unlinkSync(path.resolve(COMMAND_FILE_NAME));

  console.groupEnd();
};
export const getCommandFromStorage = () =>
  Boolean(fs.existsSync(path.resolve(COMMAND_FILE_NAME))) &&
  JSON.parse(fs.readFileSync(path.resolve(CONFIG_FILE_NAME), 'ascii'));

// Read config JSON data from file
export const readConfigFromStorage = () => {
  console.group('readConfigFromStorage fn');
  const storage =
    Boolean(fs.existsSync(path.resolve(CONFIG_FILE_NAME))) &&
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
  console.group('setConfigToStorage fn');
  console.log('Attempting to write config file to storage');

  fs.writeFileSync(path.resolve(CONFIG_FILE_NAME), JSON.stringify(payload), 'ascii');
  console.groupEnd();
};

// Merge config JSON data with one saved in the file
export const updateConfigInStorage = async (payload: Record<string, any>) => {
  console.group('updateConfigInStorage fn');
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
