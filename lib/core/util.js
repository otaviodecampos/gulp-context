var path = require('path');

exports.getRootDir = function () {
  return process.cwd();
};

exports.getRootModulesDir = function () {
  return this.normalizePath(this.getRootDir() + '/node_modules');
}

exports.normalizePath = function (p, sep) {
  var pattern = /[\\\/]+/g

  return p.replace(pattern, sep ||  path.sep);
}

exports.toPath = function () {
  var paths = [];

  for(var i = 0, len = arguments.length; i < len; i++) {
    paths.push(arguments[i]);
  }

  return this.normalizePath(paths.join(path.sep));
}

exports.requireRootModule = function (moduleName) {
  var path = this.toPath(this.getRootModulesDir(), moduleName);
  return require(path);
}
