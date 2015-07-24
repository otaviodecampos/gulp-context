var path = require('path')
		, Environment = require('./environment')
		, Task = require('./task');

module.exports = function Dinamico(conf) {
	var environments = {}
			, defaultEnvironment;

	this.build = function () {
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

	this.getEnvironment = function (name) {
		return environments[name];
	}

	this.getDefaultEnvironment = function () {
		return defaultEnvironment;
	}

	this.addEnvironment = function (environment) {
		if(environment instanceof Environment) {
			environments[environment.getName()] = environment;

			if(environment.isDefault()) {
				defaultEnvironment = environment;
			}
		} else {
			throw Error("It's not a DinamicoEnvironment instance");
		}
	}

	this.setup();

}
