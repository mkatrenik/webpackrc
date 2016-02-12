'use strict';

const path = require('path');
const fs = require('fs');
const assert = require('assert');
const debug = require('./utils').debug;

/**
 * tries to load local .webpackrc
 * @param {Object} opts
 * @param {String} opts.env
 * @returns {Object}
 */
function loadRcFile(opts) {
  const env = opts.env;
  assert(env);

  const config = {
    env: {
      [env]: {
        plugins: []
      }
    }
  };

  try {
    const rcFile = fs.readFileSync(path.join(process.cwd(), '.webpackrc')).toString();
    const parsedConfig = JSON.parse(rcFile);

    if (parsedConfig.env[env]) {
      config.env[env] = parsedConfig.env[env];
    } else {
      debug(`.webpackrc doesn't contain env[${env}]`);
    }
  } catch (err) {
    debug(`[WARN] .webpackrc doesn't exist or is not valid json, using default`, err);
  } finally {
    assert(config.env);
    assert(config.env[env]);
    assert(Array.isArray(config.env[env].plugins));
  }
  return config;
}

module.exports = loadRcFile;
