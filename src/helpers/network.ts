import 'isomorphic-fetch'; //  imported as specified in docs!
import { revokeDevice } from '../todo.js';
import restart from './restart.js';
import { clearStorage } from './storage.js';
import { INITIAL_APP_STATE } from './constants.js';

const requestAPI = async (url: string, requestPayload: Record<string, unknown>) => {
  console.group('RequestAPI fn');
  console.log('url:', url);
  console.log('payload:', requestPayload);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore ts doesn't recognise fetch as there are no types for it yet :)
  const rawResponse = await fetch(url, requestPayload);

  if (rawResponse.status === 401 || rawResponse.status === 403) {
    console.error('Unauthenticated, voiding saved settings and restarting process');
    applicationState = INITIAL_APP_STATE;
    try {
      console.log('Attempting to delete config file and other logs');
      clearStorage();
    } catch (error) {
      console.log('ERROR deleting files');
      console.error(error);
    } finally {
      await revokeDevice();

      console.groupEnd();
      restart();
    }
  }

  const response = await rawResponse.json();
  console.groupEnd();

  return response;
};

export default requestAPI;
