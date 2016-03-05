
var installed = false;

module.exports = {
  install,
  transform
};

function transform(source, options) {
  var jstransform = require('jstransform/simple');
  var instrument = require('./instrument');

  var content = jstransform.transform(source, options).code;
  return instrument(content);
}

function install(options) {
  if (installed) {
    return
  }

  var fs = require('fs');
  var Module = require('module');
  var _require = Module.prototype.require;

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

    var content = fs.readFileSync(filename, 'utf8');
    try {
      var instrumented = transform(content, options);
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