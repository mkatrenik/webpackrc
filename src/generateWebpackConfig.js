const webpack = require('webpack');
const NpmInstallPlugin = require('npm-install-webpack-plugin');
const assert = require('assert');

/* eslint no-warning-comments:[0] */
// TODO cross env

/**
 * generare config
 * @param {Object} options
 * @returns {
 *  {devtool: string, entry: *[], output: {path, filename: string, publicPath: string},
 *  plugins: *[], resolve: {extensions: string[], root: (*|String), fallback: *[]},
 *  module: {preloaders: Array, loaders: Array, postloaders: Array}, _pkgs: Array}
 * }
 */
function config(options) {
  assert(options.entry, `'entry' is missing in options`);
  assert(options.env, `'env' is missing in options`);
  assert(options.plugins, `'plugins' is missing in options`);

  const defaultConfig = {
    devtool: 'source-map',
    /* eslint no-warning-comments:[0] */
    // TODO make multi default
    entry: [
      // Polyfill EventSource for IE, as webpack-hot-middleware/client uses it
      'eventsource-polyfill',
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
      options.entry
    ],
    output: {
      path: options.distDir,
      filename: 'bundle.js',
      publicPath: '/'
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(options.env)
      }),
      new NpmInstallPlugin({
        saveDev: true
      })
    ],
    resolve: {
      extensions: ['', '.js', '.jsx', '.json', '.ts', '.tsx'],
      root: process.cwd()
    },
    module: {
      preloaders: [],
      loaders: [],
      postloaders: []
    },
    _pkgs: []
  };

  // apply plugins on config
  options.plugins.forEach(p => {
    p(defaultConfig);
  });

  return defaultConfig;
}

module.exports = config;
