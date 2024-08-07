import os from 'os';
import { execSync } from 'child_process';
import { readErrLogFromStorage, readStdLogFromStorage, saveFirmwareToStorage } from './helpers/storage.js';
import requestAPI from './helpers/network.js';
import { FIRMWARE_VERSION } from './helpers/constants.js';
import { getDeviceFirmwareVersion, performFirmwareUpdate } from './helpers/device.js';
import { Command, Config, License } from './helpers/types';

// This file contains all the functions that should be implemented in a real device
// They are called automatically by the framework

export const applyLicense = async (license: License) => {
  console.log('TODO: Apply new license is not implemented!', license);
};

export const removeLicense = async (license: License) => {
  console.log('TODO: Remove existing license is not implemented!', license);
};

const executeFirmwareUpgrade = async (command: Command) => {
  console.log('TODO: Handle update_firmware command is not implemented, performing a dummy update');

  const serverFirmwareVersion = command.parameters.version || FIRMWARE_VERSION;
  const deviceFirmwareVersion = getDeviceFirmwareVersion();

  if (serverFirmwareVersion === deviceFirmwareVersion) {
    return {
      id: command.id,
      status: 'done',
      message: `Firmware already up to date, version: ${serverFirmwareVersion}`,
    };
  }

  const firmwareUrl = command.parameters.url as string;

  const firmwareFile = await requestAPI(firmwareUrl, {
    method: 'GET',
    headers: {
      'Authorization': applicationState.auth?.access_key,
      'Content-Type': 'application/json',
    },
  });

  // Save to disk
  saveFirmwareToStorage(firmwareFile);

  await performFirmwareUpdate();

  return {
    id: command.id,
    status: 'done',
    message: `server firmware version: ${serverFirmwareVersion}, device firmware version: ${deviceFirmwareVersion}`,
  };
};

const executeRestart = async (command: Command) => {
  console.log('TODO: Handle restart command has dummy implementation');

  console.log('Attempting device restart - LINUX ONLY');
  console.log(execSync('/sbin/shutdown -r now'));

  // Device should restart immediately, the following code only runs if the device didn't restart
  return {
    id: command.id,
    status: 'failed', // other possible values are: `in_progress`, `done`
    message: 'Unable To restart device', // a message to describe `failed` status error
  };
};

const executeDump = async (command: Command) => {
  console.log('TODO: Handle dump command is not implemented!');

  const errorLogDump = readErrLogFromStorage();

  // if we have an error log dump to send - we'll send it
  if (errorLogDump) {
    const dumpId = await requestAPI(
      `${applicationState.auth?.hub_url}/v1/devices/${applicationState.auth?.id}/dumps/text%2Ftxt/agent.log`,
      {
        method: 'POST',
        headers: {
          'Authorization': applicationState.auth?.access_key,
          'Content-Type': 'text/plain',
          'Content-Length': `${errorLogDump.length}`,
        },
        body: errorLogDump,
      }
    );

    // example for appending a dump to the previous dump
    const standardLogDump = readStdLogFromStorage();
    standardLogDump &&
      (await requestAPI(`${applicationState.auth?.hub_url}/v1/devices/${applicationState.auth?.id}/dumps/${dumpId}`, {
        method: 'PUT',
        headers: {
          'Authorization': applicationState.auth?.access_key,
          'Content-Type': 'text/plain',
          'Content-Length': `${standardLogDump.length}`,
        },
        body: standardLogDump,
      }));

    return {
      id: command.id,
      status: 'done',
      message: 'Successfully uploaded err log file, and appended std log file to it',
    };
  }

  return {
    id: command.id,
    status: 'done',
    message: 'probably no dump files to upload',
  };
};

export const executeCommand = async (command: Command) => {
  console.log('TODO: Handle command', command);

  // Handle the command (synchronously)
  try {
    switch (command.name) {
      case 'update_firmware':
        return await executeFirmwareUpgrade(command);
      case 'reboot':
        return await executeRestart(command);
      case 'dump':
        return await executeDump(command);
      default:
        console.log('TODO: Handle default command');

        return {
          id: command.id,
          status: 'done',
          message: `TODO: Handle default case for command: id: ${command.id}, name: ${command.name} - marking as done`,
        };
    }
  } catch (error) {
    console.error(error);

    return {
      id: command.id,
      status: 'failed',
      message: `Unable To Execute, error: ${error}`,
    };
  }
};

export const updateConfig = async (config: Config) => {
  console.log('TODO: Update device config is not implemented!', config);
};

export const getTelemetry = async () => {
  console.log('TODO: Get telemetry data for the device is not implemented, using dummy data');

  // Get system memory
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usageMemory = Math.round(((totalMemory - freeMemory) / totalMemory) * 100);

  return {
    status: 'online',
    telemetries: {
      totalMemory,
      freeMemory,
      usageMemory,
      loadAverage: os.loadavg()[0],
      uptime: os.uptime() / 60,
      arch: os.arch(),
    },
  };
};

export const revokeDevice = async () => {
  console.log('TODO: Handle device revocation upon any network response with status=401,403');
};
