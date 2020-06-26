const env = require('./env');

const processEnv = env.get();

const { argv } = require('yargs');
const { createLauncher, proc } = require('process-launch');
const { logger } = require('jege/server');
const path = require('path');

const log = logger('[webapp-root]');

const paths = {
  config: path.resolve(__dirname, '../config/config.json'),
  keywords: path.resolve(__dirname, '../data/keywords.txt'),
};

const processDefinitions = {
  backend: proc(
    'node',
    [
      './scripts/launch.js',
      ...argv._,
    ],
    {
      cwd: `./packages/backend`,
      env: {
        NODE_ENV: 'development',
        ...processEnv,
      },
      stdio: 'inherit',
    },
  ),
  webapp: proc(
    'node',
    [
      './scripts/launch.js',
      ...argv._,
    ],
    {
      cwd: `./packages/webapp`,
      env: {
        NODE_ENV: 'development',
        ...processEnv,
      },
      stdio: 'inherit',
    },
  ),
};

const processGroupDefinitions = {
  default: ['webapp'],
};

function launcher() {
  try {
    log('launcher(): argv: %j', argv);

    const Launcher = createLauncher({
      processDefinitions,
      processGroupDefinitions,
    });

    Launcher.run({
      process: argv.process,
      processGroup: argv.processGroup,
    });
  } catch (err) {
    log('launcher(): Error reading file', err);
  }
}

module.exports = launcher;

if (require.main === module) {
  launcher();
}
