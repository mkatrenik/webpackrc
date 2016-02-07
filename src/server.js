const path = require('path');
const express = require('express');

module.exports = function server(compiler, options) {
  const app = express();

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: options.noInfo,
    publicPath: options.outputPublicPath,
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
    console.log(`listening at http://0.0.0.0:${options.port}`);
  });
};
