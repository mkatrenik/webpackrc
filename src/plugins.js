var combineLoaders = require('webpack-combine-loaders')

module.exports = {
  babel(config) {
    config.module.loaders.push({
      test: /\.jsx?$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: {
        presets: [
          'babel-preset-es2015',
          'babel-preset-react',
          'babel-preset-stage-0'
        ],
        plugins: [
          'babel-plugin-transform-runtime',
          'babel-plugin-transform-react-display-name',
          ['babel-plugin-react-transform', {
            transforms: [{
              transform: 'react-transform-hmr',
              imports: ['react'],
              locals: ['module']
            }]
          }]
        ]
      }
    })
  },
  typescript(config) {
    config.module.loaders.push({
      test: /\.tsx?$/,
      loader: 'ts-loader',
      exclude: /node_modules/
    })
  },
  json(config) {
    config.module.loaders.push({
      test: /\.json$/,
      loader: 'json'
    })
  },
  css(config) {
    config.module.loaders.push({
      test: /\.css$/,
      loader: combineLoaders([
        {
          loader: 'style'
        },
        {
          loader: 'css',
          query: {
            minimize: false,
            sourceMap: true,
            modules: true,
            importLoaders: 1,
            localIdentName: '[path]-[local]-[hash:base64:5]'
          }
        }
      ])
    })
  },
  less(config) {
    config.module.loaders.push({
      test: /\.less$/,
      loader: "style!css!less?strictMath&noIeCompat&sourceMap"
    })
  },
  sass(config) {
    config.module.loaders.push({
      test: /\.sass$/,
      loader: combineLoaders([
        {
          loader: 'style'
        },
        {
          loader: 'css',
          query: {
            minimize: false,
            sourceMap: true,
            modules: true,
            importLoaders: 1,
            localIdentName: '[path]-[local]-[hash:base64:5]'
          }
        },
        {
          loader: 'sass',
          query: {
            indentedSyntax: 'sass',
            sourceMap: true
          }
        }
      ])
    })
  },
  imagesGifPng(config) {
    config.module.loaders.push({
      test: /\.(gif|png)$/,
      loader: 'url',
      query: {
        limit: 10240
      }
    })
  },
  imagesJpg(config) {
    config.module.loaders.push({
      test: /\.jpe?g$/,
      loader: 'file'
    })
  },
  fonts(config) {
    config.module.loaders.push({
      test: /\.(otf|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url',
      query: {
        limit: 10240
      }
    })
  },
  svg(config) {
    config.module.loaders.push({
      test: /\.(svg)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url',
      query: {
        limit: 10240
      }
    })
  },
  eslint(config) {
    config.module.preloaders.push({
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'eslint'
    })
  },
  tslint(config) {
    config.module.preloaders.push({
      test: /\.tsx?$/,
      exclude: /node_modules/,
      loader: 'tslint'
    })
  }
}
