var utils = require('./utils')
    , GulpContext = require('./gulpcontext');

module.exports = function defaultParser(scope) {

    var gulpc = GulpContext.getInstance();

    if (scope.targetDir) {
        scope.targetDir = utils.toPath(scope.targetDir, this.getName());
    }

    if (scope.paths) {
        for (var name in scope.paths) {
            var path = utils.toPath(scope.targetDir, scope.paths[name]);
            scope.paths[name] = path;
        }
    }

    var fromTargetContext = this.getFromTargetContext();
    if(fromTargetContext) {
        scope.sourceDir = utils.normalizePath(gulpc.getContext(fromTargetContext).getScope().targetDir);
    }

    return scope;

}