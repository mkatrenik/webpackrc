var fs = require('fs')
var path = require('path')
var webpack = require('webpack')

/**
 * Find the node_modules directory which will be resolved from a given dir.
 */
function findNodeModules(cwd) {
  var parts = cwd.split(path.sep)
  while (parts.length > 0) {
    var target = path.join(parts.join(path.sep), 'node_modules')
    if (fs.existsSync(target)) {
      return target
    }
    parts.pop()
  }
}

module.exports = function config(options) {
  var defaultConfig = {
    devtool: 'source-map',
    // TODO make multi default
    entry: [
      // Polyfill EventSource for IE, as webpack-hot-middleware/client uses it
      'eventsource-polyfill',
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
      options.entry
    ],
    output: {
      path: __dirname + '/build',
      filename: 'bundle.js',
      publicPath: '/'
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(ENV)
      })
    ],
    resolve: {
      extensions: ['', '.js', '.jsx', '.json', '.ts', '.tsx'],
      root: process.cwd(),
      fallback: [findNodeModules(__dirname)]
    },
    module: {
      preloaders: [],
      loaders: [],
      postloaders: []
    }
  }

  options.plugins.forEach(p => {
    p(defaultConfig)
  })

  return defaultConfig;
}
