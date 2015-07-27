var util = require('util')
		, taskutil = require('./taskutil')
		, DinamicoUtil = require('./util')
		, DinamicoConf = require('./conf')
		, Dinamico = require('./dinamico');

function DinamicoTask (name, conf) {
	DinamicoTask.super_.apply(this, arguments);

	var enabled
			, filePath
			, environment
			, fn;

	this.build = function () {
		this.setup();
		this.register();

		return this;
	}

	this.setup = function () {
		filePath = taskutil.filePath(this);
		func = require(filePath);

		if(typeof(conf) == 'boolean') {
			enabled = conf;
		} else {
			// It's object
		}

		return this;
	}

	this.register = function () {
		var dinamico = Dinamico.getInstance()
				,	environmentName = this.getEnvironment().getName()
				, taskName = this.getGulpName()
				, source = dinamico.getConf().build.sourceDir
				, target = dinamico.getConf().build.targetDir
				, paths = dinamico.getConf().build.paths;

		target = [target, environmentName].join('/');
		target = DinamicoUtil.normalizePath(target);

		dinamico.task(taskName, this.getFunction(source, target, paths));

		return this;
	}

	this.getName = function () {
		return name;
	}

	this.getFilePath = function() {
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

}

util.inherits(DinamicoTask, DinamicoConf);

module.exports = DinamicoTask;
