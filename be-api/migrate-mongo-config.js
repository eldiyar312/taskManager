/* eslint-disable @typescript-eslint/no-var-requires */

require('./build/src/plugins/env');

const { resolve } = require('path');

const {
  DB_USER,
  DB_NAME,
  DB_HOST,
  DB_PASSWORD,
  DB_CERTIFICATE_PATH,
  DB_PORT,
} = require('./build/src/constants/env');

const tlsConfigs = DB_CERTIFICATE_PATH
  ? {
      tls: true,
      tlsCAFile: resolve(DB_CERTIFICATE_PATH),
    }
  : {};

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ...tlsConfigs,
};

const protocol = DB_PORT ? 'mongodb' : 'mongodb+srv';
const port = DB_PORT ? `:${DB_PORT}` : '';

const userInfo = DB_USER ? `${DB_USER}:${DB_PASSWORD}@` : '';

module.exports = {
  mongodb: {
    url: `${protocol}://${userInfo}${DB_HOST}${port}`,
    databaseName: DB_NAME,
    options,
  },

  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
  moduleSystem: 'commonjs',
};
