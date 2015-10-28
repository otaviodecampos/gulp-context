var utils = require('./utils')
    , GulpContext = require('./gulpcontext')
    , path = require('path')
    , debug = require('./debug');

module.exports = function defaultParser(scope) {

    debug.context(this.getName(), 'source is', debug.quote(debug.blue(path.resolve(scope.srcDir))));
    debug.context(this.getName(), 'target is', debug.quote(debug.blue(path.resolve(scope.buildDir))));

    return scope;
}