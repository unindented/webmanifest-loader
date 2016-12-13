var HtmlPlugin = require('html-webpack-plugin')

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
    new HtmlPlugin({
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
