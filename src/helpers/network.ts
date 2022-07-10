import fs from 'fs';
import path from 'path';
import 'isomorphic-fetch'; //  imported as specified in docs!
import { revokeDevice } from '../todo.js';
import restart from './restart.js';
import { CONFIG_FILE_NAME } from './constants.js';

const requestAPI = async (url: string, requestPayload: any) => {
  console.group('RequestAPI fn');
  console.log('url:', url);
  console.log('payload:', requestPayload);

  // @ts-ignore ts doesn't recognise fetch as there are no types for it yet :)
  const rawResponse = await fetch(url, requestPayload);

  if (rawResponse.status === 401 || rawResponse.status === 403) {
    console.error('Unauthenticated, voiding saved settings and restarting process');
    try {
      console.log('Attempting to delete config file');
      fs.unlinkSync(path.resolve(CONFIG_FILE_NAME));
    } catch (error) {
      console.log('ERROR deleting config file - config file name:', CONFIG_FILE_NAME);
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
