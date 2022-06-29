// This file contains all the functions that should be implemented in a real device
// They are called automatically by the framework and should return a Promise()

export const applyLicense = async (license: any) => {
  console.log('TODO: Apply new license', license);
  try {
    return;
  } catch (error) {
    throw error;
  }
};

export const removeLicense = async (license: any) => {
  console.log('TODO: Remove existing license', license);
  try {
    return;
  } catch (error) {
    throw error;
  }
};

export const handleCommand = async (command: any) => {
  console.log('TODO: Handle command', command);
  try {
    return;
  } catch (error) {
    throw error;
  }
};

export const updateConfig = async (config: any) => {
  console.log('TODO: Update device config', config);
  try {
    return;
  } catch (error) {
    throw error;
  }
};

export const getTelemetry = async () => {
  console.log('TODO: Get telemetry data for the device');
  try {
    return {
      status: 'online',
      telemetries: {
        ...process.resourceUsage(),
      },
    };
  } catch (error) {
    throw error;
  }
};

export const revokeDevice = async () => {
  console.log('TODO: Handle device revocation upon any network response with status=401,403');
  try {
    return;
  } catch (error) {
    throw error;
  }
};
