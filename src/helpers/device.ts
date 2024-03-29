import { FIRMWARE_VERSION } from './constants.js';
import { Command } from './types';

export const getDeviceFirmwareVersion = () => {
  console.log('TODO: handle version retrieval from OS');
  return FIRMWARE_VERSION;
};

export const performFirmwareUpdate = async () => {
  console.log("TODO: handle firmware update using the file you've saved to disk");
  return;
};

export const getCommandStatusAfterReboot = (command: Command) => {
  console.log('TODO: handle device reboot status', command);
  return { status: 'done', message: 'Device restart OK', error: '' };
};
