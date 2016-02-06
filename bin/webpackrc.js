#!/usr/bin/env node

'use strict';

require('harmonize')();

const path = require('path');
const parseArgs = require('minimist');
const fs = require('fs');
const debug = global.debug = require('debug')('webpackrc');
const util = require('util');
const assert = require('assert');

const pkg = require('../package.json');
const resolvePlugins = require('../src/resolvePlugins');
const createWebpackConfig = require('../src/generateWebpackConfig');
const server = require('../src/server');

const ENV = process.env.NODE_ENV || 'development';

function _dump(data) {
  return util.inspect(data, {showHidden: false, depth: null, colors: true});
}

let rc = null;

try {
  const rcFile = fs.readFileSync(path.join(process.cwd(), '.webpackrc')).toString();
  rc = JSON.parse(rcFile);
  debug(`.webpackrc > `, _dump(rc));
} catch (err) {
  debug(`[WARN] .webpackrc doesn't exist or is not valid json, using default`, err);
  rc = {
    env: {
      [ENV]: {
        plugins: []
      }
    }
  };
} finally {
  assert(rc.env);
  assert(rc.env[ENV]);
  assert(rc.env[ENV].plugins);
}

const args = parseArgs(process.argv.slice(2), {
  alias: {
    b: 'base',
    h: 'help',
    p: 'port',
    v: 'version'
  },
  boolean: ['help', 'version'],
  default: {
    port: 3000,
    base: process.cwd()
  }
});

if (args.version) {
  console.log(`v ${pkg.version}`);
  process.exit(0);
}
if (args.help || args._.length === 0) {
  console.log('Usage: webpackrc [options] script');
  console.log('');
  console.log('Options:');
  console.log('  -b, --base    static file\'s base path');
  console.log('  -p, --port    port to run the webpack dev server on [default: 3000]');
  console.log('  -v, --version print heatpack\'s version');
  process.exit(0);
}

const options = Object.assign({
  entry: path.resolve(args._[0]),
  noInfo: !args.info,
  port: args.port,
  base: path.resolve(args.base),
  ENV
}, rc.env[ENV]);

debug('initialized with options', _dump(options));

options.plugins = resolvePlugins(options);

const webpackConfig = createWebpackConfig(options);
server(webpackConfig, options);
