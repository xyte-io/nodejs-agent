import forever from 'forever-monitor';

console.log('Forever initializing');
console.log();

const child = new forever.Monitor('./node-agent-main.min.js', {
  silent: false,
  killTree: true,
  watch: false,
  args: [],
  // Log files and associated logging options for this instance
  logFile: './logFile.log', // Path to log output from forever process (forever-monitor as a daemon)
  outFile: './out.log', // Path to log output from child stdout
  errFile: './err.log', // Path to log output from child stderr
});

child.on('restart', function () {
  console.error('Forever restarting Xyte`s agent for ' + child.times + ' time');
});

child.on('exit:code', function (code) {
  console.error('Forever detected Xyte`s agent exited with code ' + code);
});

child.on('exit', function () {
  console.log('Xyte`s agent has exited');
});

console.log("Forever attempting to start Xyte's agent");
console.log();

child.start();
