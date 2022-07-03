import forever from 'forever-monitor';

const child = new forever.Monitor('./node-agent-main.min.js', {
  silent: false,
  killTree: true,
  watch: false,
  args: [],
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

child.start();
