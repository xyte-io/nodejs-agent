import { executeCommand } from './todo.js';
import requestAPI from './helpers/network.js';
import { getCommandStatusAfterReboot } from './helpers/device.js';
import { Command } from './helpers/types';

export const handlePendingCommandAfterReboot = async (command: Command) => {
  const { status, message, error } = getCommandStatusAfterReboot(command);

  const commandStatusPayload = JSON.stringify({ id: command.id, status, message: message || error });

  await requestAPI(`${applicationState.auth?.hub_url}/v1/devices/${applicationState.auth?.id}/command`, {
    method: 'POST',
    headers: {
      'Authorization': applicationState.auth?.access_key,
      'Content-Type': 'application/json',
      'Content-Length': `${commandStatusPayload.length}`,
    },
    body: commandStatusPayload,
  });
};

const handleCommand = async () => {
  const command: Command = await requestAPI(
    `${applicationState.auth?.hub_url}/v1/devices/${applicationState.auth?.id}/command`,
    {
      method: 'GET',
      headers: {
        'Authorization': applicationState.auth?.access_key,
        'Content-Type': 'application/json',
      },
    }
  );

  // Check if this command is already in progress
  if (command.status === 'in_progress') {
    return await handlePendingCommandAfterReboot(command);
  }

  // Update the server that the command is in progress
  const commandInProgressPayload = JSON.stringify({ id: command.id, status: 'in_progress' });
  await requestAPI(`${applicationState.auth?.hub_url}/v1/devices/${applicationState.auth?.id}/command`, {
    method: 'POST',
    headers: {
      'Authorization': applicationState.auth?.access_key,
      'Content-Type': 'application/json',
      'Content-Length': `${commandInProgressPayload.length}`,
    },
    body: commandInProgressPayload,
  });

  const commandStatus = await executeCommand(command);

  // Update the server of command execution status
  const commandStatusPayload = JSON.stringify(commandStatus);
  await requestAPI(`${applicationState.auth?.hub_url}/v1/devices/${applicationState.auth?.id}/command`, {
    method: 'POST',
    headers: {
      'Authorization': applicationState.auth?.access_key,
      'Content-Type': 'application/json',
      'Content-Length': `${commandStatusPayload.length}`,
    },
    body: commandStatusPayload,
  });
};

export default handleCommand;
