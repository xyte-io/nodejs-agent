import os from 'os';
import { executeCommand } from './todo.js';
import {
  clearCommandLogFromStorage,
  getCommandFromStorage,
  hasGracefulShutdown,
  logCommandToStorage,
  readConfigFromStorage,
} from './helpers/storage.js';
import requestAPI from './helpers/network.js';

export const checkSavedCommandAfterBoot = async (command: any) => {
  const hasFreshBooted = os.uptime() <= 60 * 5; // boot in last 5 minutes

  // update Xyte's servers of command execution - only if it's a fresh boot
  if (hasFreshBooted && command) {
    const storedConfig = readConfigFromStorage();

    const commandStatusPayload = JSON.stringify({
      id: command.id,
      status: hasGracefulShutdown() ? 'done' : 'failed',
      message: 'Device booted',
    });

    await requestAPI(`${storedConfig.hub_url}/v1/devices/${storedConfig.id}/command`, {
      method: 'POST',
      headers: {
        'Authorization': storedConfig.access_key,
        'Content-Type': 'application/json',
        'Content-Length': `${commandStatusPayload.length}`,
      },
      body: commandStatusPayload,
    });
  }

  // remove command log from storage
  clearCommandLogFromStorage();
};

const handleCommand = async (command: any) => {
  console.group('handleCommand fn');

  // check whether command wasn't tried already
  const storedCommand = getCommandFromStorage();
  if (storedCommand && storedCommand.id === command.id) {
    await checkSavedCommandAfterBoot(storedCommand);

    console.groupEnd();
    return;
  }

  const storedConfig = readConfigFromStorage();
  logCommandToStorage(command);

  const commandInProgressPayload = JSON.stringify({ id: command.id, status: 'in_progress' });
  await requestAPI(`${storedConfig.hub_url}/v1/devices/${storedConfig.id}/command`, {
    method: 'POST',
    headers: {
      'Authorization': storedConfig.access_key,
      'Content-Type': 'application/json',
      'Content-Length': `${commandInProgressPayload.length}`,
    },
    body: commandInProgressPayload,
  });

  const commandStatus = await executeCommand(command);

  const commandStatusPayload = JSON.stringify(commandStatus);
  await requestAPI(`${storedConfig.hub_url}/v1/devices/${storedConfig.id}/command`, {
    method: 'POST',
    headers: {
      'Authorization': storedConfig.access_key,
      'Content-Type': 'application/json',
      'Content-Length': `${commandStatusPayload.length}`,
    },
    body: commandStatusPayload,
  });

  clearCommandLogFromStorage();

  console.groupEnd();
};

export default handleCommand;
