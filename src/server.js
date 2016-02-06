const path = require('path');
const express = require('express');
const webpack = require('webpack');
const debug = require('./utils').debug;

module.exports = function server(webpackConfig, options) {
  const app = express();
  const compiler = webpack(webpackConfig);

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: options.noInfo,
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true
    }
  }));

  app.use(require('webpack-hot-middleware')(compiler));

  app.use(express.static(path.join(options.base, 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  app.listen(options.port, '0.0.0.0', err => {
    if (err) {
      console.error(err.stack);
      process.exit(1);
    }
    debug(`listening at http://0.0.0.0:${options.port}`);
  });
};
