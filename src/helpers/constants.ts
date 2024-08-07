console.log('-------------------------------------------------------------');
console.log('TODO: Setup device configuration in /src/helpers/constants.ts');
console.log('-------------------------------------------------------------');

// Model level settings
export const HARDWARE_KEY = '4623234a-710e-4bc5-a6c5-923de6d5f433';

// Device level settings

export const CLOUD_ID = 'QzuaKQNOxgMww6gUTTmD65em';
export const FIRMWARE_VERSION = '1.0.3';
export const DEVICE_NAME = 'Sample device';
export const SERIAL_NUMBER = '1000';

// Generic cross device settings

export const CONFIG_FILE_NAME = 'config.txt';
export const FIRMWARE_FILE_NAME = 'firmware.txt';
export const STD_LOG_FILE = 'out.log';
export const ERR_LOG_FILE = 'err.log';
export const DEVICE_PROVISIONING_SERVER = 'https://entry.xyte.io';
export const INTERVAL_IN_MS = 10 * 1000; // How often to send telemetry (in milliseconds)
export const INITIAL_APP_STATE = { auth: null, config: null, licenses: [] };
