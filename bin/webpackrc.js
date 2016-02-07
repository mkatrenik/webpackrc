#!/usr/bin/env node

'use strict';

require('harmonize')();

const webpack = require('webpack');

const resolvePlugins = require('../src/resolvePlugins');
const createWebpackConfig = require('../src/generateWebpackConfig');
const server = require('../src/server');
const loadConfig = require('../src/loadRcFile');
const utils = require('../src/utils');
const parseArgs = require('../src/parseArgs');
const installDeps = require('../src/installDependencies');

const dump = utils.dump;
const debug = utils.debug;

const ENV = process.env.NODE_ENV || 'development';

const args = parseArgs();

const rc = loadConfig({env: ENV});

const ENTRY = args.entry;

debug('initialized with options', dump({
  argv: args,
  webpackrc: rc
}));

// load plugins
const PLUGINS = resolvePlugins({
  plugins: rc.env[ENV].plugins,
  entry: ENTRY
});

// generate webpack config
const webpackConfig = createWebpackConfig({
  plugins: PLUGINS,
  entry: ENTRY,
  env: ENV,
  distDir: args.distDir
});

// install missing dependencies
installDeps(webpackConfig._pkgs);

// create webpack compiler
const compiler = webpack(webpackConfig);

if (args.dist) {
  // build files
  compiler.run(err => console.error(err));
} else {
  // run webpack-dev-server
  server(compiler, {
    base: args['server-base'],
    port: args['server-port'],
    outputPublicPath: webpackConfig.output.publicPath,
    noInfo: true
  });
}
