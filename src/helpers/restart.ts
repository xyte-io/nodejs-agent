const restart = () => {
  console.log('Restart fn - attempting exit');
  process.kill(process.pid, 'SIGTERM'); // we exit the process as forever-monitor is responsible to restart it
  return;
};

export default restart;
