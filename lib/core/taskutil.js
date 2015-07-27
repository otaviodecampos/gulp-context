var DinamicoUtil = require('./util')
    , path = require('path');

exports.filePath = function (task) {
  var rootPath = DinamicoUtil.getRootDir()
      , tasksDir = task.getEnvironment().getTasksDir()
      , taskName = task.getName()
      , filePath
      , paths = [];

  filePath = DinamicoUtil.toPath(rootPath, tasksDir, taskName);

  return filePath;
};

exports.gulpName = function (task) {
  var environmentName = task.getEnvironment().getName()
      , gulpname = task.getName();

  gulpname = DinamicoUtil.toPath(environmentName, gulpname);
  gulpname = DinamicoUtil.normalizePath(gulpname, ':');

  return gulpname;
}
