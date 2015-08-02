var utils = require('./utils');

module.exports = function defaultParser(scope) {

    if (scope.targetDir) {
        scope.targetDir = utils.toPath(scope.targetDir, this.getName());
    }

    if (scope.paths) {
        for (var name in scope.paths) {
            var path = utils.toPath(scope.targetDir, scope.paths[name]);
            scope.paths[name] = path;
        }
    }

    return scope;

}