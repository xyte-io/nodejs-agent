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

export const handlePendingCommandAfterReboot = async (authData: any, command: any) => {
  // TODO Vladimir: Call user's callback to tell him that his command causes restart and what status to return to server (success or error)
  const { status, message, error } = userGetCommandStatusAfterReboot(command);

  const commandStatusPayload = JSON.stringify({ id: command.id, status, message, error });

  await requestAPI(`${authData.hub_url}/v1/devices/${authData.id}/command`, {
    method: 'POST',
    headers: {
      'Authorization': authData.access_key,
      'Content-Type': 'application/json',
      'Content-Length': `${commandStatusPayload.length}`
    },
    body: commandStatusPayload
  });
};

const handleCommand = async (authData: any, command: any) => {
  // Check if this command is already in progress
  if (command && command.status === 'in_progress') {
    return await handlePendingCommandAfterReboot(authData, command);
  }

  // Update the server that the command is in progress
  const commandInProgressPayload = JSON.stringify({ id: command.id, status: 'in_progress' });
  await requestAPI(`${authData.hub_url}/v1/devices/${authData.id}/command`, {
    method: 'POST',
    headers: {
      'Authorization': authData.access_key,
      'Content-Type': 'application/json',
      'Content-Length': `${commandInProgressPayload.length}`,
    },
    body: commandInProgressPayload,
  });

  const commandStatus = await executeCommand(authData, command);

  // Update the server of command execution status
  const commandStatusPayload = JSON.stringify(commandStatus);
  await requestAPI(`${authData.hub_url}/v1/devices/${authData.id}/command`, {
    method: 'POST',
    headers: {
      'Authorization': authData.access_key,
      'Content-Type': 'application/json',
      'Content-Length': `${commandStatusPayload.length}`,
    },
    body: commandStatusPayload,
  });
};

export default handleCommand;
