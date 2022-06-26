import process from 'node:process';
// This file contains all the functions that should be implemented in a real device
// They are called automatically by the framework and should return a Promise()

export const applyLicense = async (license: any) => {
  console.log('TODO: Apply new license', license);
  try {
    return Promise.resolve();
  } catch (error) {
    throw error;
  }
};

export const removeLicense = async (license: any) => {
  console.log('TODO: Remove existing license', license);
  try {
    return Promise.resolve();
  } catch (error) {
    throw error;
  }
};

export const handleCommand = async (command: any) => {
  console.log('TODO: Handle command', command);
  try {
    return Promise.resolve();
  } catch (error) {
    throw error;
  }
};

export const updateConfig = async (config: any) => {
  console.log('TODO: Update device config', config);
  try {
    return Promise.resolve();
  } catch (error) {
    throw error;
  }
};

export const getTelemetry = async () => {
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
