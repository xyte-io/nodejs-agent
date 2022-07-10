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
export const setShutdownToStorage = () => {
  console.log('Mark safe shutdown: ', TURNED_OFF_FILE_NAME);
  fs.writeFileSync(path.resolve(TURNED_OFF_FILE_NAME), '', 'ascii');
}

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
  console.log('Save current command being executed to file');

  fs.writeFileSync(path.resolve(COMMAND_FILE_NAME), JSON.stringify(commandInfo), 'ascii');
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
  const storage =
    Boolean(fs.existsSync(path.resolve(CONFIG_FILE_NAME))) &&
    JSON.parse(fs.readFileSync(path.resolve(CONFIG_FILE_NAME), 'ascii'));

  return Boolean(storage) ? storage : null;
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
  console.log('Save authorization to local storage');

  setConfigToStorage({ ...readConfigFromStorage(), ...payload });
};

/* Succeed if stored data has an 'id' property, return an error otherwise */
export const authenticateDeviceFromStorage = () => {
  const storedSettings = readConfigFromStorage();

  console.log('Get device authentication data: ', storedSettings);

  return Boolean(storedSettings?.id) ? storedSettings : null;
};
