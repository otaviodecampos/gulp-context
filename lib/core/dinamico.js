var path = require('path')
		, DinamicoUtil = require('./util')
		, gulp = DinamicoUtil.requireRootModule('gulp')
		, Environment = require('./environment')
		, Task = require('./task')
		, instance;

function Dinamico () {
		var environments = {}
				, defaultEnvironment
				, conf;

		this.DEFAULT = 'default';

		this.build = function (c) {
			conf = c;
			this.setup();

			return this;
		}

		this.setup = function () {
			for (var name in conf.environments) {
				var envconf = conf.environments[name];
				var environment = new Environment(name, envconf);

				this.addEnvironment(environment);
			}

			return this;
		}

		this.getConf = function () {
			return conf;
		}

		this.getEnvironment = function (name) {
			return environments[name];
		}

		this.getDefaultEnvironment = function () {
			return defaultEnvironment;
		}

		this.addEnvironment = function (environment) {
			if(environment instanceof Environment) {
				var name = environment.getName();
				environments[name] = environment.build();

				if(!defaultEnvironment && environment.isDefault()) {
					defaultEnvironment = environment;
					this.task(this.DEFAULT, [name]);
				}
			} else {
				throw Error("It's not a DinamicoEnvironment instance");
			}
		}

		this.task = function (name, dependencies, fn) {
			gulp.task(name, dependencies, fn);
			return this;
		}

	}

function getInstance () {
	if(!instance) {
			 instance = new Dinamico();
	 }
	 return instance;
}

exports.getInstance = getInstance
