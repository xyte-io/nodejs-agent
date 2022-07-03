// This file contains all the functions that should be implemented in a real device
// They are called automatically by the framework and should return a Promise()
// returning a value automatically resolves the Promise

export const applyLicense = async (license: any) => {
  console.group('ApplyLicense fn');
  console.log('TODO: Apply new license', license);
  try {
    return;
  } catch (error) {
    throw error;
  } finally {
    console.groupEnd();
  }
};

export const removeLicense = async (license: any) => {
  console.group('RemoveLicense fn');
  console.log('TODO: Remove existing license', license);
  try {
    return;
  } catch (error) {
    throw error;
  } finally {
    console.groupEnd();
  }
};

export const handleCommand = async (command: any) => {
  console.group('HandleCommand fn');
  console.log('TODO: Handle command', command);
  try {
    return;
  } catch (error) {
    throw error;
  } finally {
    console.groupEnd();
  }
};

export const updateConfig = async (config: any) => {
  console.group('UpdateConfig fn');
  console.log('TODO: Update device config', config);
  try {
    return;
  } catch (error) {
    throw error;
  } finally {
    console.groupEnd();
  }
};

export const getTelemetry = async () => {
  console.group('GetTelemetry fn');
  console.log('TODO: Get telemetry data for the device');
  try {
    return {
      status: 'online',
      telemetries: {
        ...process.memoryUsage(),
      },
    };
  } catch (error) {
    throw error;
  } finally {
    console.groupEnd();
  }
};

export const revokeDevice = async () => {
  console.group('RevokeDevice fn');
  console.log('TODO: Handle device revocation upon any network response with status=401,403');
  try {
    return;
  } catch (error) {
    throw error;
  } finally {
    console.groupEnd();
  }
};
