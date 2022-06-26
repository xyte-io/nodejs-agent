import restart from './restart';
import { revokeDevice } from '../todo';

const requestAPI = async (url: string, requestPayload: any) => {
  const rawResponse = await fetch(url, requestPayload);

  if (rawResponse.status === 401 || rawResponse.status === 403) {
    console.error('Unauthenticated, voiding saved settings and restarting process');

    await revokeDevice();

    restart();
  }

  return await rawResponse.json();
};

export default requestAPI;
