#!/usr/bin/env node

'use strict';

const path = require('path')
const parseArgs = require('minimist')
const fs = require('fs')
const debug = global.debug = require('debug')('webpackrc')
const util = require('util')

const pkg = require('../package.json')
const resolvePlugins = require('../src/resolvePlugins')
const createWebpackConfig = require('../src/webpack.config')
const server = require('../src/server')

const ENV = global.ENV = process.env.NODE_ENV || 'development'

function _dump(data) {
  return util.inspect(data, { showHidden: false, depth: null })
}

let rc = null;

try {
  let rcFile = fs.readFileSync(`${process.cwd()}/.webpackrc`).toString()
  rc = JSON.parse(rcFile)
  debug(`.webpackrc > `, _dump(rc))
} catch (err) {
  debug(`[WARN] .webpackrc doesn't exist or is not valid json`, err)
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
})

if (args.version) {
  console.log('v' + pkg.version)
  process.exit(0)
}
if (args.help || args._.length === 0) {
  console.log('Usage: webpackrc [options] script')
  console.log('')
  console.log('Options:')
  console.log('  -b, --base    static file\'s base path')
  console.log('  -p, --port    port to run the webpack dev server on [default: 3000]')
  console.log('  -v, --version print heatpack\'s version')
  process.exit(0)
}

const options = Object.assign({
  entry: path.resolve(args._[0]),
  noInfo: !args.info,
  port: args.port,
  base: path.resolve(args.base)
}, rc['env'][ENV])

debug('initialized with options', _dump(options))

options.plugins = resolvePlugins(options)

const webpackConfig = createWebpackConfig(options)
server(webpackConfig, options)
