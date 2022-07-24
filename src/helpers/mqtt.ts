import mqtt, { QoS } from 'mqtt';

class Mqtt {
  client: mqtt.MqttClient | null = null;

  connect(url: string, deviceId: string, accessKey: string) {
    this.client = mqtt.connect(url, {
      protocolVersion: 5,
      username: deviceId,
      password: accessKey,
      clientId: deviceId,
    });

    this.client.on('connect', () => {
      console.log('MQTT connected');
      this.client?.subscribe(
        [
          `v1/device/${deviceId}/update`,
          `v1/device/${deviceId}/config`,
          `v1/device/${deviceId}/commands`,
          `v1/device/${deviceId}/license`,
          `v1/device/${deviceId}/space_info`,
          `v1/device/${deviceId}/firmware`,
        ],
        (error) => {
          if (error) {
            console.log('failed subscribing');
            return;
          }

          console.log('subscribe to messages');
        }
      );
    });

    this.client.on('error', (err) => {
      console.log(err);
    });
  }

  publish({
    topic,
    payload,
    qos = 1,
    correlationData,
  }: {
    topic: string;
    payload: unknown;
    qos?: QoS;
    correlationData?: any;
  }) {
    this.client?.publish(
      topic,
      JSON.stringify(payload),
      {
        qos,
        properties: {
          correlationData: correlationData ? Buffer.from(correlationData) : undefined,
          userProperties: {
            device_id: global.applicationState!.auth!.id,
            access_key: global.applicationState!.auth!.access_key,
          },
        },
      },
      (error) => {
        if (error) {
          console.log('failed to publish', error);
        }
      }
    );
  }
}

const mqttClient = new Mqtt();

export { mqttClient };
