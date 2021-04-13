'use strict';

const nconf = require('nconf');
const json5 = require('json5');
const path = require('path');
const fs = require('fs');
const StandardError = require('standard-error');
const rootPath = path.normalize(__dirname + '/..');

// Load app configuration
const computedConfig = {
    root: rootPath,
    modelsDir: rootPath + '/models'
};

//
// Setup nconf to use (in-order):
//   1. Locally computed config
//   2. Command-line arguments
//   3. Some Environment variables
//   4. Some defaults
//   5. Environment specific config file located at './env/<NODE_ENV>.json'
//   6. Shared config file located at './env/all.json'
//
nconf.argv()
    .env(['PORT', 'NODE_ENV', 'FORCE_DB_SYNC', 'forceSequelizeSync', 'IP'])// Load select environment variables
    .defaults({
        store: {
            NODE_ENV: 'development'
        }
    });
const envConfigPath = rootPath + '/config/env/' + nconf.get('NODE_ENV') + '.json5';
if (!fs.statSync(envConfigPath).isFile()) {
    throw new StandardError('Environment specific config file not found! Throwing up! (NODE_ENV=' + nconf.get('NODE_ENV') + ')');
}
nconf.file(nconf.get('NODE_ENV'), { file: envConfigPath, type: 'file', format: json5 })
    .file('shared', { file: rootPath + '/config/env/all.json5', type: 'file', format: json5 })
    .add('base-defaults', {
        type: 'literal',
        store: {
            PORT: 5555
        }
    }).overrides({ store: computedConfig });

module.exports = nconf.get();
