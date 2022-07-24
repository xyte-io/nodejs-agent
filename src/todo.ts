import { execSync } from 'child_process';
import { readErrLogFromStorage, readStdLogFromStorage, saveFirmwareToStorage } from './helpers/storage.js';
import requestAPI from './helpers/network.js';
import { FIRMWARE_VERSION } from './helpers/constants.js';
import { getDeviceFirmwareVersion, performFirmwareUpdate } from './helpers/device.js';
import { Command, Config, Licence } from './helpers/types';

// This file contains all the functions that should be implemented in a real device
// They are called automatically by the framework

export const applyLicense = async (license: Licence) => {
  console.group('ApplyLicense fn');
  console.log('TODO: Apply new license', license);
  try {
    return;
  } catch (error) {
    throw error;
  } finally {
    console.groupEnd();
  }
};

export const removeLicense = async (license: Licence) => {
  console.group('RemoveLicense fn');
  console.log('TODO: Remove existing license', license);
  try {
    return;
  } catch (error) {
    throw error;
  } finally {
    console.groupEnd();
  }
};

const executeFirmwareUpgrade = async (command: Command) => {
  console.log('TODO: Handle update_firmware command');
  console.log('example firmware version compare, firmware retrieving ');

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
  console.log('TODO: Handle restart command');
  console.log('attempting device restart - LINUX ONLY');

  console.log('make sure that you have permissions!');
  console.log(execSync('/sbin/shutdown -r now'));

  console.log("device should restart immediately, if we've reached this point it didn't");
  return {
    id: command.id,
    status: 'failed', // other possible values are: `in_progress`, `done`
    message: 'Unable To restart device', // a message to describe `failed` status error
  };
};

const executeDump = async (command: Command) => {
  console.log('TODO: Handle dump command');
  console.log('attempting device dump - simply sending logs');

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
  console.group('HandleCommand fn');
  console.log('TODO: Handle command', command);

  // Handle the command (synchronously)
  try {
    switch (command.name) {
      case 'update_firmware':
        return await executeFirmwareUpgrade(command);
      case 'restart':
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
  } finally {
    console.log("if we've reached this point device didn't shutdown");
    console.groupEnd();
  }
};

export const updateConfig = async (config: Config) => {
  console.log('TODO: Update device config', config);
  try {
    return;
  } catch (error) {
    throw error;
  }
};

export const getTelemetry = async () => {
  console.group('GetTelemetry fn');
  console.log('TODO: Get telemetry data for the device');
  try {
    return {
      status: 'online',
      telemetries: {
        ...process.memoryUsage(),
      },
    };
  } catch (error) {
    throw error;
  } finally {
    console.groupEnd();
  }
};

export const revokeDevice = async () => {
  console.log('TODO: Handle device revocation upon any network response with status=401,403');
  try {
    return;
  } catch (error) {
    throw error;
  }
};
