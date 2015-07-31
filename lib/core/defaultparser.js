*'+-var DinamicoUtil = require('./util');
00
module.exports = function defaultParser(params) {

    params.target = [params.target, this.getName()].join('/');
    params.target = DinamicoUtil.normalizePath(params.target);

    console.log(params.target);

    for(var name in params.paths) {
        var path = params.paths[name];

        path = DinamicoUtil.toPath(params.target, path);

        console.log(path);
    }

    return params;

}