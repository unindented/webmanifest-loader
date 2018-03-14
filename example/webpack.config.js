const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'production',

  entry: {
    app: './index.js'
  },

  output: {
    path: path.resolve(__dirname, 'dist/'),
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
