import fs from 'node:fs';
import path from 'node:path';
import fetch from 'isomorphic-fetch';
import restart from './restart.js';
import { revokeDevice } from '../todo.js';
import { CONFIG_FILE_NAME } from './constants.js';

const requestAPI = async (url: string, requestPayload: any) => {
  console.log('- RequestAPI fn - START', url, requestPayload);

  const rawResponse = await fetch(url, requestPayload);

  if (rawResponse.status === 401 || rawResponse.status === 403) {
    console.error('Unauthenticated, voiding saved settings and restarting process');
    try {
      fs.unlinkSync(path.resolve(CONFIG_FILE_NAME));
    } catch (error) {
      console.log('* RequestAPI fn - fs.unlinkSync 401,403 - ERROR - config file name:', CONFIG_FILE_NAME);
      console.error(error);
    } finally {
      await revokeDevice();

      restart();
    }
  }

  return await rawResponse.json();
};

export default requestAPI;
