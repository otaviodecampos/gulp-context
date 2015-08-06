var util = require('util')
    , taskutils = require('./taskutils')
    , Conf = require('./conf')
    , GulpContext = require('./gulpcontext')
    , utils = require('./utils');

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
        filePath = conf.path || taskutils.filePath(this);
        fn = require(filePath); // throw error quando o arquivo nao existir.

        return this;
    }

    this.register = function () {
        var _this = this
            , taskName = this.getGulpName();

        scope.watch = this.watch;
        scope.name = name;
        scope.filepath = filePath;
        scope.gulpname = this.getGulpName();
        scope.input = this.input;

        gulpc.task(taskName, this.getDependencies(), function (cb) {
            var stream = _this.getFunction().call(scope, cb);
            if (stream && stream.on) {
                stream.on('error', function () {
                    // log
                });
            }
            return stream;

        });

        return this;
    }

    this.input = function input (base, list) {
        var path
            , paths = []

        for(var i = 0, len = list.length; i < len; i++) {
            var b = base;
            path = list[i];
            if(path.indexOf('!') == 0) {
               path = path.substring(1);
                b = '!' + b;
            }
            paths.push(utils.toPath(b, path));
        }

        return this.watch(paths);
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

        return this;
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
            , context = this.getContext()
            , defaultTasks = context.getDefaultTasks()
            , fromTargetContext = context.getFromTargetContext()
            , r;

        if(!deps) deps = [];

        if (typeof(deps) == 'string') {
            var task = context.getTask(deps);
            if (task.isEnabled()) {
                deps = [task.getGulpName()];
            } else {
                deps = [];
            }
        } else if (util.isArray(deps)) {
            r = [];

            for (var i = 0, len = deps.length; i < len; i++) {
                var task = context.getTask(deps[i]);
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


        for(var name in defaultTasks) {
            var task = defaultTasks[name];
            if(task.getGulpName() != this.getGulpName()) {
                deps.push(task.getGulpName());
            }
        }

        if(fromTargetContext) {
            deps.push(fromTargetContext);
        }

        return deps;
    }

}

util.inherits(Task, Conf);

module.exports = Task;
