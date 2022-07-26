import { mqttClient } from './helpers/mqtt.js';
import { IPublishPacket } from 'mqtt-packet';
import { isCommandMessage, onCommandReceived } from './command.js';
import { Command, Config, FirmwareVersion, License } from './helpers/types';
import { isLicenseMessage, onLicenseCommand } from './licenses.js';
import { isConfigMessage, onConfigMessage } from './config.js';
import { isFirmwareVersionMessage, onFirmwareVersionMessage } from './firmware-version.js';

export const listenToMessages = () => {
  mqttClient.client?.on('message', async (topic: string, payload: Buffer, packet: IPublishPacket) => {
    console.log({ topic, payload, packet });

    try {
      const message: unknown = JSON.parse(payload.toString());
      const responseTopic = packet.properties?.responseTopic;

      if (isCommandMessage(topic)) {
        await onCommandReceived(message as Command, responseTopic!);
      }

      if (isLicenseMessage(topic)) {
        await onLicenseCommand(message as License, responseTopic!);
      }

      if (isConfigMessage(topic)) {
        await onConfigMessage(message as Config, responseTopic!);
      }

      if (isFirmwareVersionMessage(topic)) {
        await onFirmwareVersionMessage(message as FirmwareVersion);
      }
    } catch (error) {
      console.error(`Failed parsing message for topic: ${topic}`, payload.toString());
    }
  });
};
