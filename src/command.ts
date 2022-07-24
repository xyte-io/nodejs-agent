import { executeCommand } from './todo.js';
import { Command } from './helpers/types';
import { mqttClient } from './helpers/mqtt.js';

export const isCommandMessage = (topic: string) => /^v1\/device\/.*\/commands$/.test(topic);

export const onCommandReceived = async (command: Command, responseTopic: string) => {
  // Update the server that the command is in progress
  mqttClient.publish({
    topic: responseTopic,
    payload: { id: command.id, status: 'in_progress' },
    correlationData: command.id,
  });

  const commandStatus = await executeCommand(command);

  mqttClient.publish({ topic: responseTopic, payload: commandStatus, correlationData: command.id });
};
