import { execSync } from 'child_process';
import compareVersions from 'compare-versions';
import {
  readConfigFromStorage,
  readErrLogFromStorage,
  readStdLogFromStorage,
  removeShutdownFromStorage,
  setFirmwareToStorage,
  setShutdownToStorage,
} from './helpers/storage.js';
import requestAPI from './helpers/network.js';
import { FIRMWARE_FILE_NAME, FIRMWARE_VERSION } from './helpers/constants.js';

// This file contains all the functions that should be implemented in a real device
// They are called automatically by the framework

export const applyLicense = async (license: any) => {
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

export const removeLicense = async (license: any) => {
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

export const executeCommand = async (command: any) => {
  console.group('HandleCommand fn');
  console.log('TODO: Handle command', command);

  const storedConfig = readConfigFromStorage();

  try {
    switch (command.name) {
      case 'update_firmware':
        console.log('TODO: Handle update_firmware command');
        console.log('example firmware version compare, firmware retrieving ');

        const serverFirmwareVersion = command?.parameters?.version || FIRMWARE_VERSION;
        const deviceFirmwareVersion = FIRMWARE_VERSION;

        if (compareVersions(serverFirmwareVersion, deviceFirmwareVersion)) {
          const firmwareUrl = command.parameters.url;

          console.log('this is a simple GET to any url, you may want to use Xyte GetFile API');
          const firmwareFile = await requestAPI(firmwareUrl, {
            method: 'GET',
            headers: {
              'Authorization': storedConfig.access_key,
              'Content-Type': 'application/json',
            },
          });

          // save to disk
          setFirmwareToStorage(firmwareFile);

          // example for running system command with firmware file,
          // usually firmware upgrade will cause the device to restart, so you'll have to handle that.
          // please refer to restart command handling (one of the cases in current switch block) for more information.
          const hasFirmwareInStorage = execSync('ls').toString().includes(FIRMWARE_FILE_NAME);

          return {
            id: command.id,
            status: hasFirmwareInStorage ? 'done' : 'failed',
            message: `server firmware version: ${serverFirmwareVersion}, device firmware version: ${deviceFirmwareVersion}`,
          };
        }

        return {
          id: command.id,
          status: 'done',
          message: `all I know is that: server firmware version (${serverFirmwareVersion}) <= device firmware version (${deviceFirmwareVersion})`,
        };
      case 'restart':
        console.log('TODO: Handle restart command');
        console.log('attempting device restart - LINUX ONLY');

        // this is a planned restart
        setShutdownToStorage();

        console.log('make sure that you have permissions!');
        console.log(execSync('/sbin/shutdown -r now'));

        console.log("device should restart immediately, if we've reached this point it didn't");
        return {
          id: command.id,
          status: 'failed', // other possible values are: `in_progress`, `done`
          message: 'Unable To restart device', // a message to describe `failed` status error
        };
      case 'dump':
        console.log('TODO: Handle dump command');
        console.log('attempting device dump - simply sending logs');

        const errorLogDump = readErrLogFromStorage();

        // if we have an error log dump to send - we'll send it
        if (errorLogDump) {
          const dumpId = await requestAPI(
            `${storedConfig.hub_url}/v1/devices/${storedConfig.id}/dumps/text%2Ftxt/agent.log`,
            {
              method: 'POST',
              headers: {
                'Authorization': storedConfig.access_key,
                'Content-Type': 'text/plain',
                'Content-Length': `${errorLogDump.length}`,
              },
              body: errorLogDump,
            }
          );

          // example for appending a dump to the previous dump
          const standardLogDump = readStdLogFromStorage();
          standardLogDump &&
            (await requestAPI(`${storedConfig.hub_url}/v1/devices/${storedConfig.id}/dumps/${dumpId}`, {
              method: 'PUT',
              headers: {
                'Authorization': storedConfig.access_key,
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
    removeShutdownFromStorage();

    console.groupEnd();
  }
};

export const updateConfig = async (config: any) => {
  console.group('UpdateConfig fn');
  console.log('TODO: Update device config', config);
  try {
    return;
  } catch (error) {
    throw error;
  } finally {
    console.groupEnd();
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
  console.group('RevokeDevice fn');
  console.log('TODO: Handle device revocation upon any network response with status=401,403');
  try {
    return;
  } catch (error) {
    throw error;
  } finally {
    console.groupEnd();
  }
};
