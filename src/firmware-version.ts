import { upgradeFirmware } from './todo.js';
import { mqttClient } from './helpers/mqtt.js';
import { getDeviceFirmwareVersion } from './helpers/device.js';
import { FirmwareVersion } from './helpers/types';

export const isFirmwareVersionMessage = (topic: string) => /^v1\/device\/.*\/firmware$/.test(topic);

export const onFirmwareVersionMessage = async (firmwareVersion: FirmwareVersion) => {
  console.log('example firmware version compare, firmware retrieving ');

  const serverFirmwareVersion = firmwareVersion.latest_fw_version;
  const deviceFirmwareVersion = getDeviceFirmwareVersion();

  console.log({ serverFirmwareVersion, deviceFirmwareVersion });
  if (serverFirmwareVersion === deviceFirmwareVersion) {
    return;
  }

  await upgradeFirmware(firmwareVersion.latest_fw_file_id);

  mqttClient.publish({
    topic: `v1/device/${global.applicationState!.auth!.id}/update`,
    payload: {
      firmwareVersion: firmwareVersion,
    },
  });
};
