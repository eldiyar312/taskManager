const { resolve } = require('path');
const { spawnSync } = require('child_process');

spawnSync(process.platform === 'win32' ? 'yarn.cmd' : 'yarn', ['build'], {
  stdio: 'inherit',
  cwd: resolve(__dirname),
});
