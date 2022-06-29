const restart = () => {
  console.log('Restart fn - attempting exit');
  process.exit(); // we exit the process as pm2 is responsible to restart it
  return;
};

export default restart;
