# webmanifest loader for webpack [![Version](https://img.shields.io/npm/v/webmanifest-loader.svg)](https://www.npmjs.com/package/webmanifest-loader) [![Build Status](https://img.shields.io/travis/unindented/webmanifest-loader.svg)](https://travis-ci.org/unindented/webmanifest-loader)

Parses your [web app manifest](https://www.w3.org/TR/appmanifest/), loading the necessary files from your `icons` and `screenshots` sections.

It also treats your web app manifest as a `lodash` template, so you can interpolate variables or add any other logic you need.


## Installation

```sh
$ npm install --save webmanifest-loader
```


## Usage

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

Say you are using [`html-webpack-plugin`](https://github.com/ampedandwired/html-webpack-plugin), and you want to add a web app manifest. Your HTML template `template.ejs` could look like this:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title><%= htmlWebpackPlugin.options.title %></title>
    <link rel="manifest" href="<%= require('./manifest.webmanifest') %>" />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

Your `manifest.webmanifest` file could look like this:

```json
{
  "name": "<%= name %>",
  "short_name": "<%= shortName %>",
  "description": "<%= description %>",
  "start_url": ".",
  "display": "standalone",
  "icons": [
    {
      "src": "./icon_144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "./icon_192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ],
  "screenshots": [
    {
      "src": "./screenshot.jpg",
      "sizes": "640x480",
      "type": "image/jpeg"
    },
    {
      "src": "./screenshot@2x.jpg",
      "sizes": "1280x920",
      "type": "image/jpeg"
    }
  ]
}
```

And your `webpack.config.js` file would glue everything together:

```js
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    app: './index.js'
  },

  output: {
    path: './dist/',
    filename: '[name].js'
  },

  module: {
    rules: [
      {
        test: /\.webmanifest$/,
        include: /assets\//,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          },
          {
            loader: 'webmanifest-loader',
            options: {
              name: 'Foobar',
              shortName: 'Foobar',
              description: 'Just an example.'
            }
          }
        ]
      },
      {
        test: /\.(jpg|png)$/,
        include: /assets\//,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]'
          }
        }
      }
    ]
  },

  plugins: [
    new HtmlPlugin({
      title: 'Foobar',
      template: './assets/template.ejs'
    })
  ]
}
```

Running `webpack` would produce all the necessary files as expected:

```
$ npm run build

> example@1.0.0 build /Users/daniel/Code/webmanifest-loader/example
> webpack

Hash: 6988311fefbc63ba7777
Version: webpack 4.1.1
Time: 390ms
Built at: 2018-3-13 20:23:05
               Asset       Size  Chunks             Chunk Names
manifest.webmanifest  586 bytes          [emitted]
   screenshot@2x.jpg    0 bytes          [emitted]
      screenshot.jpg    0 bytes          [emitted]
    icon_192x192.png    0 bytes          [emitted]
    icon_144x144.png    0 bytes          [emitted]
              app.js  571 bytes       0  [emitted]  app
          index.html  354 bytes          [emitted]
Entrypoint app = app.js
   [0] ./index.js 22 bytes {0} [built]
Child html-webpack-plugin for "index.html":
                   Asset       Size  Chunks             Chunk Names
    manifest.webmanifest  586 bytes          [emitted]
       screenshot@2x.jpg    0 bytes          [emitted]
          screenshot.jpg    0 bytes          [emitted]
        icon_192x192.png    0 bytes          [emitted]
        icon_144x144.png    0 bytes          [emitted]
     + 1 hidden asset
    Entrypoint undefined = index.html
       [0] ./assets/manifest.webmanifest 66 bytes {0} [built]
       [1] (webpack)/buildin/module.js 519 bytes {0} [built]
       [2] (webpack)/buildin/global.js 509 bytes {0} [built]
       [4] ./node_modules/html-webpack-plugin/lib/loader.js!./assets/template.ejs 779 bytes {0} [built]
       [5] ./assets/screenshot@2x.jpg 63 bytes [built]
       [6] ./assets/screenshot.jpg 60 bytes [built]
       [7] ./assets/icon_192x192.png 62 bytes [built]
       [8] ./assets/icon_144x144.png 62 bytes [built]
        + 1 hidden module
```

Go to the [`example` folder](/example) and try it yourself:

```
$ cd example
$ npm install
$ npm run build
```


## Meta

* Code: `git clone git://github.com/unindented/webmanifest-loader.git`
* Home: <https://github.com/unindented/webmanifest-loader/>


## Contributors

* Daniel Perez Alvarez ([unindented@gmail.com](mailto:unindented@gmail.com))


## License

Copyright (c) 2017 Daniel Perez Alvarez ([unindented.org](http://unindented.org/)). This is free software, and may be redistributed under the terms specified in the LICENSE file.
