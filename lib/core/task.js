var util = require('util')
    , taskutils = require('./taskutils')
    , Conf = require('./conf')
    , GulpContext = require('./gulpcontext')
    , utils = require('./utils')
    , debug = require('./debug');

function Task(name, conf, scope) {
    Task.super_.apply(this, arguments);

    var gulpc = GulpContext.getInstance()
        , enabled
        , filePath
        , context
        , fn
        , deps;

    this.init = function () {
        if (typeof(conf) == 'boolean') {
            enabled = conf == true;
        } else if (typeof(conf) == 'object' && !Array.isArray(conf)) {
            enabled = conf.enabled != false;
            deps = conf.dep;
        } else {
            enabled = true;
            deps = conf;
        }
    }();

    this.build = function () {
        this.setup();

        if(this.getFunction()) {
            this.register();
        }

        return this;
    }

    this.setup = function () {
        filePath = conf.path || taskutils.filePath(this);
        try {
            fn = require(filePath);
        } catch (e) {
            debug.context(this.getContext().getName(), 'file task not found', debug.quote(debug.red(filePath)));
        }

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
        var context = this.getContext()
        , defaultTasks = context.getDefaultTasks()
        , after = context.getAfter()
        , r
        , d = JSON.parse(JSON.stringify(deps || []));

        if (typeof(d) == 'string') {
            var task = context.getTask(d);
            if (task.isEnabled()) {
                d = [task.getGulpName()];
            } else {
                d = [];
            }
        } else if (util.isArray(d)) {
            r = [];

            for (var i = 0, len = d.length; i < len; i++) {
                var task = context.getTask(d[i]);
                if (task.isEnabled()) {
                    d[i] = task.getGulpName();
                } else {
                    r.push(i);
                }
            }

            for (var i = 0, len = r.length; i < len; i++) {
                var index = r[i];
                d.splice(index, 1);
            }
        }


        for(var name in defaultTasks) {
            var task = defaultTasks[name];
            if(task.getGulpName() != this.getGulpName()) {
                d.push(task.getGulpName());
            }
        }

        if(after) {
            d = d.concat(after);
        }

        return d;
    }

}

util.inherits(Task, Conf);

module.exports = Task;
