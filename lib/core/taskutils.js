var utils = require('./utils')
    , path = require('path');

exports.filePath = function (task) {
  var rootPath = utils.getRootDir()
      , taskDir = task.getContext().getTaskDir()
      , taskName = task.getName()
      , filePath
      , paths = [];

  filePath = utils.toPath(rootPath, taskDir, taskName);

  return filePath;
};

exports.gulpName = function (task) {
  var environmentName = task.getContext().getName()
      , gulpname = task.getName();

  gulpname = utils.toPath(environmentName, gulpname);
  gulpname = utils.normalizePath(gulpname, ':');

  return gulpname.replace(':\\', '');
}
