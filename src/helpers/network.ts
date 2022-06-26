import restart from './restart.js';
import { revokeDevice } from '../todo.js';

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
