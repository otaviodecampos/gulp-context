var utils = require('./utils');

module.exports = function defaultParser(scope) {

    if (scope.target) {
        scope.target = utils.toPath(scope.target, this.getName());
    }

    if (scope.paths) {
        for (var name in scope.paths) {
            var path = utils.toPath(scope.target, scope.paths[name]);
            scope.paths[name] = path;
        }
    }

    return scope;

}