var util = require('util')
    , utils = require('./utils')
    , taskutils = require('./taskutils')
    , Conf = require('./conf')
    , GulpContext = require('./gulpcontext');

function Task(name, conf, scope) {
    Task.super_.apply(this, arguments);

    var gulpc = GulpContext.getInstance()
        , enabled
        , filePath
        , context
        , fn;

    this.init = function () {
        if (typeof(conf) == 'boolean') {
            enabled = conf == true;
        } else if (typeof(conf) == 'object') {
            enabled = conf.enabled != false;
        }
    }();

    this.build = function () {
        this.setup();
        this.register();

        return this;
    }

    this.setup = function () {
        filePath = taskutils.filePath(this);
        fn = require(filePath); // log

        return this;
    }

    this.register = function () {
        var _this = this
            , taskName = this.getGulpName();

        scope.watch = this.watch;
        scope.name = name;
        scope.filepath = filePath;
        scope.gulpname = this.getGulpName();

        gulpc.task(taskName, this.getDependencies(), function () {
            var stream = _this.getFunction().call(scope);
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

        if(context.isWatch()) {
            gulpc.watch(input, [this.getGulpName()]);
        }

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

    this.setContext = function (c) {
        context = c
    }

    this.getContext = function () {
        return context;
    }

    this.getFunction = function () {
        return fn;
    }

    this.getGulpName = function () {
        return taskutils.gulpName(this);
    }

    this.getDependencies = function () {
        var deps = conf.dep
            , env = this.getContext()
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

util.inherits(Task, Conf);

module.exports = Task;
