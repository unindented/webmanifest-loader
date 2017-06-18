const vm = require('vm')
const async = require('async')
const template = require('lodash.template')
const loaderUtils = require('loader-utils')

function assign (target) {
  const to = Object(target)

  for (let i = 1, l = arguments.length; i < l; i++) {
    const source = arguments[i]

    if (source != null) {
      for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          to[key] = source[key]
        }
      }
    }
  }

  return to
}

function getManifest (source, data) {
  const processedSource = template(source)(data)
  return JSON.parse(processedSource)
}

function formatManifest (manifest) {
  return JSON.stringify(manifest, null, 2)
}

function getTasks (loaderContext, options, manifest) {
  return options.resolve.reduce(function (memo, field) {
    const images = manifest[field]

    if (Array.isArray(images)) {
      memo.push.apply(memo, images.map(function (image) {
        return resolveSrc.bind(null, loaderContext, options, image)
      }))
    }

    return memo
  }, [])
}

function resolveSrc (loaderContext, options, image, callback) {
  const context = loaderContext.context
  const request = loaderUtils.urlToRequest(image.src)

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
  const script = new vm.Script(src, {
    filename: filename,
    displayErrors: true
  })

  const sandbox = {
    module: {},
    __webpack_public_path__: publicPath || ''
  }

  script.runInNewContext(sandbox)

  return sandbox.module.exports.toString()
}

const defaults = {
  resolve: ['icons', 'screenshots']
}

module.exports = function (source, map) {
  this.cacheable && this.cacheable()
  const callback = this.async()

  const config = loaderUtils.getOptions(this)
  const options = assign({
    publicPath: this.options.output.publicPath
  }, defaults, config)

  try {
    const manifest = getManifest(source, options)
    const tasks = getTasks(this, options, manifest)

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
