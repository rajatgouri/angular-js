'use strict';

const nconf = require('nconf');
const json5 = require('json5');
const _ = require('lodash');
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const StandardError = require('standard-error');

const rootPath = path.normalize(__dirname + '/..');

// Load app configuration
const computedConfig = {
    root: rootPath
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
    .env(['PORT', 'NODE_ENV', 'IP'])// Load select environment variables
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
    })
    .overrides({ store: computedConfig });

module.exports = nconf.get();
/**
 * Get files by glob patterns
 */
module.exports.getGlobbedFiles = function (globPatterns, removeRoot) {
    // For context switching
    const _this = this;

    // URL paths regex
    const urlRegex = new RegExp('^(?:[a-z]+:)?//', 'i');

    // The output array
    let output = [];

    // If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob
    if (_.isArray(globPatterns)) {
        globPatterns.forEach(function (globPattern) {
            output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
        });
    } else if (_.isString(globPatterns)) {
        if (urlRegex.test(globPatterns)) {
            output.push(globPatterns);
        } else {
            let files = glob(globPatterns, { sync: true });

            if (removeRoot) {
                files = files.map(function (file) {
                    return file.replace(removeRoot, '');
                });
            }

            output = _.union(output, files);
        }
    }

    return output;
};

/**
 * Get the modules JavaScript files
 */
module.exports.getJavaScriptAssets = function (includeTests) {
    let output = this.getGlobbedFiles(this.assets.lib.js.concat(this.assets.js), 'public/');

    // To include tests
    if (includeTests) {
        output = _.union(output, this.getGlobbedFiles(this.assets.tests));
    }

    return output;
};

/**
 * Get the modules CSS files
 */
module.exports.getCSSAssets = function () {
    return this.getGlobbedFiles(this.assets.lib.css.concat(this.assets.css), 'public/');
};
