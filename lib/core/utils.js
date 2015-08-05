var path = require('path'),
    _this = this;

exports.getRootDir = function () {
  return process.cwd();
};

exports.getRootModulesDir = function () {
  return this.normalizePath(this.getRootDir() + '/node_modules');
}

exports.normalizePath = function (p, sep) {
  var pattern = /[\\\/]+/g

  p = p.replace(pattern, sep ||  path.sep);

  if(!p.endsWith(path.sep)) {
    p = p + path.sep;
  }

  return p;
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

exports.copy = function (obj) {
  return JSON.parse(JSON.stringify(obj));
}

exports.dashToCamel = function(str) {
  if(str == undefined) {
    str = this;
  }

  return str.replace(/\-+(.)/g, function (x, chr) {
    return chr.toUpperCase();
  });
}

exports.jsonDashToCamelParser = function (k, v) {
  var newKey = _this.dashToCamel(k);
  this[newKey] = v;
  if (newKey != k) {
    return undefined;
  }
  return v;
}