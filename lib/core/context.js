var util = require('util')
    , utils = require('./utils')
    , Conf = require('./conf')
    , Task = require('./task')
    , GulpContext = require('./gulpcontext');

function Context(name, conf, parsers) {
    Context.super_.apply(this, arguments);

    var tasks = {}
        , defaultTasks = {}
        , gulpc = GulpContext.getInstance()
        , defaultTasksNames = gulpc.getDefaultTasks();

    this.build = function () {
        this.setup();
        this.register();

        return this;
    }

    this.setup = function () {

        var scope = utils.copy(gulpc.getConf().scope);

        for (var i = 0, len = parsers.length; i < len; i++) {
            var parser = parsers[i];
            scope = parser.call(this, scope);
        }

        for (var name in defaultTasksNames) {
            var path = defaultTasksNames[name];
            var task = {
                "enabled": false,
                "path": path
            };

            task = new Task(name, task, utils.copy(scope));
            this.addTask(task, true).build();
        }

        for (var name in conf.task) {
            var task = conf.task[name];
            task = new Task(name, task, utils.copy(scope));
            this.addTask(task);
        }

        for (var name in tasks) {
            var task = tasks[name];
            if (task.isEnabled()) {
                task.build();
            }
        }

        return this;
    }

    this.addTask = function (task, defaults) {
        if (task instanceof Task) {
            task.setContext(this);

            if(defaults) {
                defaultTasks[task.getName()] = task;
            } else {
                tasks[task.getName()] = task;
            }
        } else {
            throw Error("It's not a Task");
        }

        return task;
    }

    this.getTask = function (name) {
        return tasks[name] || defaultTasks[name];
    }

    this.getDependencies = function () {
        var dependencies = [];

        dependencies = dependencies.concat(this.getDefaultTaskGulpNames());

        for (var task in tasks) {
            task = tasks[task];
            if (task.isEnabled()) {
                dependencies.push(task.getGulpName());
            }
        }

        return dependencies;
    }

    this.getDefaultTasks = function () {
        return defaultTasks;
    }

    this.getDefaultTaskGulpNames = function () {
        var names = [];
        for(var task in defaultTasks) {
            task = defaultTasks[task];
            names.push(task.getGulpName());
        }
        return names;

    }

    this.register = function () {
        gulpc.task(this.getName(), this.getDependencies());
    }

    this.isDefault = function () {
        return conf.default == true;
    }

    this.getTaskDir = function () {
        return conf.taskDir || '';
    }

    this.isWatch = function () {
        return conf.watch == true;
    }

    this.isClean = function () {
        return conf.clean == true;
    }

}

util.inherits(Context, Conf);

module.exports = Context;
