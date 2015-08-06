var utils = require('./utils')
    , GulpContext = require('./gulpcontext');

module.exports = function defaultParser(scope) {

    var gulpc = GulpContext.getInstance()
        , fromTargetContext = this.getFromTargetContext()
        , source = {}
        , target = {};

    if (scope.targetDir) {
        scope.targetDir = utils.toPath(scope.targetDir, this.getName());
    }

    if(fromTargetContext) {
        scope.sourceDir = utils.normalizePath(gulpc.getContext(fromTargetContext).getScope().targetDir);
    }

    if (scope.paths) {
        for (var name in scope.paths) {
            var path = scope.paths[name];
            source[name] = utils.toPath(scope.sourceDir, path);
            target[name] = utils.toPath(scope.targetDir, path);
        }

        scope.paths = {};
        scope.paths.source = source;
        scope.paths.target = target;
    }

    return scope;

}