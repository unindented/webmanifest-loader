const loader = require('../index.js')
const fixture = JSON.stringify(require('./fixture.json'), null, 2)
const expected = JSON.stringify(require('./expected.json'), null, 2)

const publicPath = 'http://localhost:3000/'

const mockContext = function (query, callback) {
  const result = {
    options: {
      output: {
        publicPath
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

  if (query) {
    result.query = query
  }

  return result
}

module.exports.test = {

  'processes web app manifest': function (test) {
    const callback = function (err, result) {
      test.equal(err, null)
      test.equal(result, expected)
      test.done()
    }
    const context = mockContext({
      name: 'foo',
      shortName: 'bar',
      description: 'baz',
      publicPath
    }, callback)
    loader.call(context, fixture)
    test.expect(2)
  }

}
