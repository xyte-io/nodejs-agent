import fs from 'fs';
import path from 'path';
import { assert, describe, afterEach, test, vi } from 'vitest';
import fetchMock from 'fetch-mock';
import main from '../src/main';
import authenticateDevice from '../src/authentication';
import { authenticateDeviceFromStorage, readConfigFromStorage } from '../src/helpers/storage';
import { CONFIG_FILE_NAME, DEVICE_PROVISIONING_SERVER, INITIAL_APP_STATE } from '../src/helpers/constants';

const configFileContents =
  '{"auth": {"id":"12345678-1234-1234-1234-123456789012","access_key":"12345678901234567890123456789012", "hub_url": "https://xyte.io", "hub_url_static_cert": "https://xyte.io"}}';
const configFileParsed = JSON.parse(configFileContents);

describe('Authenticate and register device', () => {
  afterEach(() => {
    applicationState = INITIAL_APP_STATE;

    console.log('removing files:', CONFIG_FILE_NAME);
    fs.existsSync(path.resolve(CONFIG_FILE_NAME)) && fs.unlinkSync(path.resolve(CONFIG_FILE_NAME));

    console.log('flushing network mocks');
    fetchMock.reset();
  });

  test('Authenticate from storage - only getting config from storage', async () => {
    fs.writeFileSync(path.resolve(CONFIG_FILE_NAME), configFileContents, 'ascii');

    const configStorage =
      fs.existsSync(path.resolve(CONFIG_FILE_NAME)) &&
      JSON.parse(fs.readFileSync(path.resolve(CONFIG_FILE_NAME), 'ascii'));

    assert.deepEqual((await configStorage).auth, configFileParsed.auth);
    assert.deepEqual((await readConfigFromStorage()).auth, configFileParsed.auth);

    applicationState = INITIAL_APP_STATE;
    await authenticateDeviceFromStorage();
    assert.deepEqual(applicationState.auth, configFileParsed.auth);

    applicationState = INITIAL_APP_STATE;
    await authenticateDevice();
    assert.deepEqual(applicationState.auth, configFileParsed.auth);
  });

  test('Register device - fail to authenticate from storage and succeed registering (by mock registration response)', async () => {
    const configStorage =
      fs.existsSync(path.resolve(CONFIG_FILE_NAME)) &&
      JSON.parse(fs.readFileSync(path.resolve(CONFIG_FILE_NAME), 'ascii'));

    assert.isFalse(configStorage);

    const registrationResponseMock = {
      id: '12345678-1234-1234-1234-1234567890ab',
      access_key: '12345678901234567890123456789012',
      hub_url: 'https://xyte.io',
      hub_url_static_cert: 'https://xyte.io',
    };

    fetchMock.post(`${DEVICE_PROVISIONING_SERVER}/v1/devices`, {
      status: 201,
      body: JSON.stringify(registrationResponseMock),
    });

    await authenticateDevice();
    assert.deepEqual(applicationState.auth, registrationResponseMock);

    const newConfigStorage =
      fs.existsSync(path.resolve(CONFIG_FILE_NAME)) &&
      JSON.parse(fs.readFileSync(path.resolve(CONFIG_FILE_NAME), 'ascii'));

    assert.deepEqual(newConfigStorage.auth, registrationResponseMock);
  });

  test('Fail to Authenticate and register', async () => {
    fetchMock.post(`${DEVICE_PROVISIONING_SERVER}/v1/devices`, {
      status: 422,
      body: JSON.stringify({ error: 'TEST: Nano has already been taken' }),
    });

    await authenticateDevice();
    assert.equal(applicationState.auth, null);
  });

  test('Fail to Authenticate and register - and retry! should call setTimeout once', async () => {
    fetchMock.post(`${DEVICE_PROVISIONING_SERVER}/v1/devices`, {
      status: 422,
      body: JSON.stringify({ error: 'TEST: Nano has already been taken' }),
    });
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout');

    assert.equal(setTimeoutSpy.callCount, 0);

    await main();

    assert.equal(setTimeoutSpy.callCount, 1);
  });
});
