const path = require('path');
const uniq = require('lodash.uniq');
const debug = require('./utils').debug;

// load default plugins
// iterate over `plugins`:
//  - look in default plugins map
//  - load from npm plugins { name -> fun }
//  - if is local file apply

const DEFAULT_PLUGINS_NAMES = [
  'json',
  'css',
  'imagesGifPng',
  'imagesJpg',
  'fonts',
  'svg'
];

const DEFAULT_PLUGINS = require('./defaultPlugins').plugins;

/**
 * detects if plugin is user provided
 * @param {Strinng} pluginName
 * @returns {null|Object}
 */
function getLocalPlugin(pluginName) {
  const filePath = path.resolve(process.cwd(), pluginName);
  try {
    return require(filePath);
  } catch (err) {
    return null;
  }
}

/**
 * return plugin either from default or user provided
 * @param {String} pluginName
 * @returns {Function}
 */
function lookupPlugin(pluginName) {
  const localPlugin = getLocalPlugin(pluginName);
  if (localPlugin) {
    return localPlugin;
  }

  if (DEFAULT_PLUGINS[pluginName]) {
    return DEFAULT_PLUGINS[pluginName];
  }
  throw new Error(`Can't find plugin ${pluginName}`);
}

/**
 * return array of plugins
 * @param {Object} options
 * @returns {Array}
 */
function resolvePlugins(options) {
  if (options.entry.match(/tsx?$/)) {
    options.plugins.push('typescript');
  }

  if (options.entry.match(/jsx?$/)) {
    options.plugins.push('babel');
  }
  // console.log(options);
  const uniqPlugins = uniq(DEFAULT_PLUGINS_NAMES.concat(options.plugins));
  debug(`applying plugins {${uniqPlugins.join(', ')}}`);

  return uniqPlugins.map(p => {
    return lookupPlugin(p);
  });
}

module.exports = resolvePlugins;
module.exports.lookupPlugin = lookupPlugin;
module.exports.getLocalPlugin = getLocalPlugin;
