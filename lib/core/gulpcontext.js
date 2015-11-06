var prototype = require('./prototype')
    , path = require('path')
    , fs = require('fs')
    , utils = require('./utils')
    , gulp = utils.requireRootModule('gulp')
    , Context = require('./context')
    , Task = require('./task')
    , instance
    , defaultParser = require('./defaultparser')
    , debug = require('./debug');

function GulpContext() {
    var contexts = {}
        , defaultContext
        , conf
        , parsers = [defaultParser]
        , defaultTasks;

    this.DEFAULT = 'default';

    this.build = function (c) {
        conf = JSON.parse(JSON.stringify(c), utils.jsonDashToCamelParser);
        this.setup();

        return this;
    }

    this.setup = function () {
        for (var name in conf) {
            var context = conf[name];
            context = new Context(name, context, parsers);

            this.addContext(context);
        }

        return this;
    }

    this.getConf = function () {
        return conf;
    }

    this.getContext = function (name) {
        return contexts[name];
    }

    this.getDefaultContext = function () {
        return defaultContext;
    }

    this.addContext = function (context) {
        if (context instanceof Context) {
            var name = context.getName();
            contexts[name] = context.build();

            if (!defaultContext && context.isDefault()) {
                defaultContext = context;
                this.task(this.DEFAULT, [name]);
            }
        } else {
            throw Error("It's not a Context");
        }
    }

    this.addParser = function (fn) {
        if (parsers.indexOf(fn) == -1) {
            parsers.push(fn);
        }
    }

    this.task = function (name, dependencies, fn) {
        gulp.task(name, dependencies, fn);
        return this;
    }

    this.watch = function (paths, dependencies) {
        
        var gulpCallback = gulp.doneCallback;
        gulp.doneCallback = function() {
            if(gulpCallback) {
                gulpCallback();
            }
            
            if(Array.isArray(paths)) {
                for(var i in paths) {
                    debug.context(debug.red('Watching'), debug.quote(paths[i]));              
                }
            } else {
                debug.context(debug.red('Watching'), paths);
            }
        }
        
        gulp.watch(paths, dependencies);
        return this;
    }

    this.getDefaultTasks = function () {
        if(!defaultTasks) {
            defaultTasks = {};
            var tasks = fs.readdirSync(__dirname + '/../task');
            for(var i = 0, len = tasks.length; i < len; i++) {
                var name = tasks[i].replace('.js', '');
                defaultTasks[name] = path.normalize(__dirname + '/../task/' + name);
            }
        }
        return defaultTasks;
    }

}

function getInstance() {
    if (!instance) {
        instance = new GulpContext();
    }
    return instance;
}

exports.getInstance = getInstance
