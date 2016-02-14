# webpackrc

On the fly webpack config generator
  - provides preconfigured common webpack loaders & dev server with hot reloading
  - extensible through .webpackrc & plugin system
  - auto install dependencies

Simplest steps to serve typecript app
```bash
npm i -g webpackrc
webpackrc index.ts
```
(Go to localhost:3000)


### Preconfigured webpack loaders:
  - default: json, css, imagesGifPng (png & gif formats), imagesJpg (jpg format), fonts, svg, babel or typescript based on entry file extension (js/jsx vs ts/tsx)
  - additional loaders: less, sass, eslint, tslint

To customize resulting webpack config, create `.webpackrc` file, like this:
```
{
  "env": {
    "development": {
      "plugins": [
        "tslint",
        "sass"
      ]
    }
  }
}
```
Plugin can also be path to file which exports function, like `function(config: WebpackConfig) {...}`, config is webpack config object you can mutate, see `src/plugins.js`.


### Debugging
To see `webpackrc` logs, run with:
```bash
DEBUG=webpackrc webpackrc src/index.tsx 
```
