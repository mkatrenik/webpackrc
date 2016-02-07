#!/usr/bin/env node

'use strict';

require('harmonize')();

const path = require('path');

const resolvePlugins = require('../src/resolvePlugins');
const createWebpackConfig = require('../src/generateWebpackConfig');
const server = require('../src/server');
const loadConfig = require('../src/loadRcFile');
const utils = require('../src/utils');
const parseArgs = require('../src/parseArgs');
const installDeps = require('../src/installDependencies');

const dump = utils.dump;
const debug = utils.debug;

const env = process.env.NODE_ENV || 'development';

const args = parseArgs();
const rc = loadConfig({env});

const options = Object.assign({
  entry: path.resolve(args.entry),
  noInfo: !args.info,
  port: args.port,
  base: path.resolve(args.base),
  env
}, rc.env[env]);

debug('initialized with options', dump(options));

options.plugins = resolvePlugins(options);

const webpackConfig = createWebpackConfig(options);
installDeps(webpackConfig._pkgs);

server(webpackConfig, options);
