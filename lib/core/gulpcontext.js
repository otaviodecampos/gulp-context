var path = require('path')
    , utils = require('./utils')
    , gulp = utils.requireRootModule('gulp')
    , Context = require('./context')
    , Task = require('./task')
    , instance
    , defaultParser = require('./defaultparser');

function GulpContext() {
    var contexts = {}
        , defaultContext
        , conf
        , parsers = [defaultParser];

    this.DEFAULT = 'default';

    this.build = function (c) {
        conf = c;
        this.setup();

        return this;
    }

    this.setup = function () {
        for (var name in conf.context) {
            var context = conf.context[name];
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
        gulp.watch(paths, dependencies);
        return this;
    }

}

function getInstance() {
    if (!instance) {
        instance = new GulpContext();
    }
    return instance;
}

exports.getInstance = getInstance
