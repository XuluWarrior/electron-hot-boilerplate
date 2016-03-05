
var installed = false;

function install(options) {
  if (installed) {
    return
  }

  var fs = require('fs');
  var Module = require('module');
  var _require = Module.prototype.require;
  var jstransform = require('jstransform/simple');
  var instrument = require('./instrument');

  if ('string' === typeof options) {
    options = {
      extension: options
    }
  }

  options = options || {};

  Module._extensions[options.extension || '.jsx'] = function(module, filename) {
    if (!options.hasOwnProperty('react')) {
      options.react = true
    }

    var content = fs.readFileSync(filename, 'utf8')
    try {
      content = jstransform.transform(content, options).code
      const instrumented = instrument(content);
      module._compile(instrumented, filename)
    } catch (e) {
      console.error("Error compiling " + filename, e)
    }
  };

  Module.prototype.require = function(filename) {
    if ('!' === filename.slice(-1)) {
      filename = filename.slice(0, -1)
    }
    return _require.call(this, filename)
  };

  installed = true
}

module.exports = install;
