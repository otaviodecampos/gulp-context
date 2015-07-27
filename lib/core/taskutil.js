var DinamicoUtil = require('./util')
    , path = require('path');

exports.filePath = function (task) {
  var rootPath = DinamicoUtil.getRootDir()
      , tasksDir = task.getEnvironment().getTasksDir()
      , taskName = task.getName()
      , filePath
      , paths = [];

  filePath = [rootPath, tasksDir, taskName].join(path.sep);
  filePath = DinamicoUtil.normalizePath(filePath);

  return filePath;
};

exports.gulpName = function (task) {
  var environmentName = task.getEnvironment().getName()
      , gulpname = task.getName();

  gulpname = [environmentName, gulpname].join(path.sep);
  gulpname = DinamicoUtil.normalizePath(gulpname, ':');

  return gulpname;
}
