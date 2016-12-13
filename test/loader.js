var loader = require('../index.js')
var fixture = JSON.stringify(require('./fixture.json'), null, 2)
var expected = JSON.stringify(require('./expected.json'), null, 2)

var mockContext = function (options, callback) {
  var result = {
    options: {
      output: {
        publicPath: 'http://localhost:3000/'
      }
    },

    dependencies: [],

    cacheable: function () {
    },

    async: function () {
      return callback
    },

    resolve: function (dirname, filename, cb) {
      cb(null, filename.replace(/^\.\//, ''))
    },

    addDependency: function (filename) {
      this.dependencies.push(filename)
    },

    loadModule: function (filename, cb) {
      cb(null, 'module.exports = __webpack_public_path__ + "' + filename + '";')
    }
  }

  if (options) {
    result.options.webmanifest = options
  }

  return result
}

module.exports.test = {

  'processes web app manifest': function (test) {
    var callback = function (err, result) {
      test.equal(err, null)
      test.equal(result, expected)
      test.done()
    }
    var context = mockContext({
      name: 'foo',
      shortName: 'bar',
      description: 'baz'
    }, callback)
    loader.call(context, fixture)
    test.expect(2)
  }

}
