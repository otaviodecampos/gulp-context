var util = require('util')
    , taskutil = require('./taskutil')
    , DinamicoUtil = require('./util')
    , DinamicoConf = require('./conf')
    , Dinamico = require('./dinamico');

function DinamicoTask(name, conf) {
    DinamicoTask.super_.apply(this, arguments);

    var enabled
        , filePath
        , environment
        , fn;

    this.init = function () {
        if (typeof(conf) == 'boolean') {
            enabled = conf == true;
        } else if(typeof(conf) == 'object') {
            enabled = conf.enabled != false;
        }
    }();

    this.build = function () {
        this.setup();
        this.register();

        return this;
    }

    this.setup = function () {
        filePath = taskutil.filePath(this);
        fn = require(filePath); // log

        return this;
    }

    this.register = function () {
        var _this = this
            , dinamico = Dinamico.getInstance()
            , environmentName = this.getEnvironment().getName()
            , taskName = this.getGulpName()
            , source = dinamico.getConf().build.sourceDir
            , target = dinamico.getConf().build.targetDir
            , paths = dinamico.getConf().build.paths;

        target = [target, environmentName].join('/');
        target = DinamicoUtil.normalizePath(target);

        dinamico.task(taskName, this.getDependencies(), function () {
            var stream = _this.getFunction().call(_this, source, target, paths);
            if (stream && stream.on) {
                stream.on('error', function () {
                    // log
                });
            }
            return stream;

        });

        return this;
    }

    this.watch = function (input) {
        Dinamico.getInstance()
            .watch(input, [this.getGulpName()]);

        return input;
    }

    this.getName = function () {
        return name;
    }

    this.getFilePath = function () {
        return filePath;
    }

    this.isEnabled = function () {
        return enabled;
    }

    this.setEnvironment = function (e) {
        environment = e
    }

    this.getEnvironment = function () {
        return environment;
    }

    this.getFunction = function () {
        return fn;
    }

    this.getGulpName = function () {
        return taskutil.gulpName(this);
    }

    this.getDependencies = function () {
        var deps = conf.dep
            , env = this.getEnvironment()
            , r;


        if (deps) {
            if (typeof(deps) == 'string') {
                var task = env.getTask(deps);
                if (task.isEnabled()) {
                    deps = [task.getGulpName()];
                } else {
                    deps = [];
                }
            } else if (util.isArray(deps)) {
                r = [];

                for (var i = 0, len = deps.length; i < len; i++) {
                    var task = env.getTask(deps[i]);
                    if (task.isEnabled()) {
                        var gulpname = task.getGulpName();
                        deps[i] = gulpname;
                    } else {
                        r.push(i);
                    }
                }

                for (var i = 0, len = r.length; i < len; i++) {
                    var index = r[i];
                    deps.splice(index, 1);
                }
            }
        }

        return deps;
    }

}

util.inherits(DinamicoTask, DinamicoConf);

module.exports = DinamicoTask;
