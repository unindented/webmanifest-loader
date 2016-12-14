# webmanifest loader for webpack [![Version](https://img.shields.io/npm/v/webmanifest-loader.svg)](https://www.npmjs.com/package/webmanifest-loader) [![Build Status](https://img.shields.io/travis/unindented/webmanifest-loader.svg)](https://travis-ci.org/unindented/webmanifest-loader) [![Dependency Status](https://img.shields.io/gemnasium/unindented/webmanifest-loader.svg)](https://gemnasium.com/unindented/webmanifest-loader)

Parses your [web app manifest](https://www.w3.org/TR/appmanifest/), loading the necessary files from your `icons` and `screenshots` sections, and respecting your `publicPath` configuration.

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
    loaders: [
      {
        test: /\.webmanifest$/,
        include: /assets\//,
        loader: [
          'file?name=[name].[ext]',
          'webmanifest'
        ].join('!')
      },
      {
        test: /\.(jpg|png)$/,
        include: /assets\//,
        loader: 'file?name=[name].[ext]'
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Foobar',
      template: './assets/template.ejs'
    })
  ],

  webmanifest: {
    name: 'Foobar',
    shortName: 'Foobar',
    description: 'Just an example.'
  }
}
```

Running `webpack` would produce all the necessary files as expected:

```
$ npm run build

> example@1.0.0 build /tmp/example
> webpack

Hash: ad3ccbf58c6ab5c73672
Version: webpack 1.14.0
Time: 418ms
               Asset       Size  Chunks             Chunk Names
    icon_144x144.png    6.31 kB          [emitted]
    icon_192x192.png    8.64 kB          [emitted]
      screenshot.jpg    19.1 kB          [emitted]
   screenshot@2x.jpg      27 kB          [emitted]
manifest.webmanifest  564 bytes          [emitted]
              app.js    1.41 kB       0  [emitted]  app
          index.html  344 bytes          [emitted]
   [0] ./index.js 22 bytes {0} [built]
Child html-webpack-plugin for "index.html":
                   Asset       Size  Chunks             Chunk Names
        icon_144x144.png    6.31 kB          [emitted]
        icon_192x192.png    8.64 kB          [emitted]
          screenshot.jpg    19.1 kB          [emitted]
       screenshot@2x.jpg      27 kB          [emitted]
    manifest.webmanifest  564 bytes          [emitted]
        + 8 hidden modules
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

Copyright (c) 2016 Daniel Perez Alvarez ([unindented.org](http://unindented.org/)). This is free software, and may be redistributed under the terms specified in the LICENSE file.
