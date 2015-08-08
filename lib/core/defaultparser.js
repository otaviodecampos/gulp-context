var utils = require('./utils')
    , GulpContext = require('./gulpcontext')
    , path = require('path')
    , debug = require('./debug');

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
            source[name] = utils.toPath(scope.sourceDir, scope.paths[name]);
            target[name] = utils.toPath(scope.targetDir, scope.paths[name]);
        }

        scope.paths = {};
        scope.paths.source = source;
        scope.paths.target = target;
    }

    debug.context(this.getName(), 'source is', debug.quote(debug.blue(path.resolve(scope.sourceDir))));
    debug.context(this.getName(), 'target is', debug.quote(debug.blue(path.resolve(scope.targetDir))));

    return scope;

}