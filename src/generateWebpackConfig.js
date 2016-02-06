const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const NpmInstallPlugin = require('npm-install-webpack-plugin');
const spawn = require('cross-spawn');

/* eslint no-warning-comments:[0] */
// TODO cross env

/**
 * Find the node_modules directory which will be resolved from a given dir.
 */
function findNodeModules(cwd) {
  const parts = cwd.split(path.sep);
  while (parts.length > 0) {
    const target = path.join(parts.join(path.sep), 'node_modules');
    if (fs.existsSync(target)) {
      return target;
    }
    parts.pop();
  }
}

function install(dep) {
  const args = ['install'].concat(dep).filter(Boolean);
  console.info('Installing `%s`...', args);
  const output = spawn.sync('npm', args, {stdio: 'inherit'});
  return output;
}

module.exports = function config(options) {
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
      path: path.join(__dirname, 'build'),
      filename: 'bundle.js',
      publicPath: '/'
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(options.ENV)
      }),
      new NpmInstallPlugin({
        saveDev: true
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
    },
    _pkgs: []
  };

  options.plugins.forEach(p => {
    p(defaultConfig);
  });

  const pkg = require(path.join(process.cwd(), 'package.json'));
  const installedDeps = [].concat(
    Object.keys(pkg.devDependencies),
    Object.keys(pkg.dependencies)
  );

  const notInstalledDeps = defaultConfig._pkgs.filter(p =>
    installedDeps.indexOf(p) !== -1
  );

  notInstalledDeps.forEach(p => {
    install(p);
  });

  return defaultConfig;
};
