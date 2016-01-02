const path = require('path')
const uniq = require('lodash.uniq')
const fs = require('fs')


// load default plugins
// iter over `plugins`:
//  - look in default plugins map
//  - load from npm plugins { name -> fun }
//  - if is local file apply

const DEFAULT_PLUGINS = [
  'json',
  'css',
  'imagesGifPng',
  'imagesJpg',
  'fonts',
  'svg'
]

const DEFAULT_PLUGINS_MODIFIERS = require(path.resolve(__dirname, 'plugins'))

function isLocalPlugin(pluginName) {
  if (fs.existsSync(pluginName)) {
    const filePath = path.resolve(process.cwd(), pluginName)
    return require(filePath)
  }
}

function lookupPlugin(pluginName) {
  const localPlugin = isLocalPlugin(pluginName)
  if (localPlugin) {
    return localPlugin
  }

  // TODO load plugins from npm

  if (DEFAULT_PLUGINS_MODIFIERS[pluginName]) {
    return DEFAULT_PLUGINS_MODIFIERS[pluginName]
  }
}

module.exports = function(options) {
  if (options.entry.match(/tsx?$/)) {
    options.plugins.push('typescript')
  }

  if (options.entry.match(/jsx?$/)) {
    options.plugins.push('babel')
  }

  const uniqPlugins = uniq(DEFAULT_PLUGINS.concat(options.plugins))
  debug(`applying plugins {${uniqPlugins.join(', ')}}`)

  return uniqPlugins.map(p => {
    return lookupPlugin(p)
  })
}
