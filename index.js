var vm = require('vm')
var async = require('async')
var template = require('lodash.template')
var loaderUtils = require('loader-utils')

function assign (target) {
  var to = Object(target)

  for (var i = 1, l = arguments.length; i < l; i++) {
    var source = arguments[i]

    if (source != null) {
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          to[key] = source[key]
        }
      }
    }
  }

  return to
}

function getManifest (source, data) {
  var processedSource = template(source)(data)
  return JSON.parse(processedSource)
}

function formatManifest (manifest) {
  return JSON.stringify(manifest, null, 2)
}

function getTasks (loaderContext, options, manifest) {
  return options.resolve.reduce(function (memo, field) {
    var images = manifest[field]

    if (Array.isArray(images)) {
      memo.push.apply(memo, images.map(function (image) {
        return resolveSrc.bind(null, loaderContext, options, image)
      }))
    }

    return memo
  }, [])
}

function resolveSrc (loaderContext, options, image, callback) {
  var context = loaderContext.context
  var request = loaderUtils.urlToRequest(image.src)

  loaderContext.resolve(context, request, function (err, filename) {
    if (err) {
      return callback(err)
    }

    loaderContext.addDependency(filename)

    loaderContext.loadModule(filename, function (err, source) {
      if (err) {
        return callback(err)
      }

      image.src = runModule(source, filename, options.publicPath)

      callback()
    })
  })
}

function runModule (src, filename, publicPath) {
  var script = new vm.Script(src, {
    filename: filename,
    displayErrors: true
  })

  var sandbox = {
    module: {},
    __webpack_public_path__: publicPath || ''
  }

  script.runInNewContext(sandbox)

  return sandbox.module.exports.toString()
}

var defaults = {
  resolve: ['icons', 'screenshots']
}

module.exports = function (source, map) {
  this.cacheable && this.cacheable()
  var callback = this.async()

  var config = loaderUtils.getLoaderConfig(this, 'webmanifest')
  var options = assign({
    publicPath: this.options.output.publicPath
  }, defaults, config)

  try {
    var manifest = getManifest(source, options)
    var tasks = getTasks(this, options, manifest)

    async.parallel(tasks, function (err) {
      if (err) {
        return callback(err)
      }

      callback(null, formatManifest(manifest))
    })
  } catch (err) {
    callback(err)
  }
}
