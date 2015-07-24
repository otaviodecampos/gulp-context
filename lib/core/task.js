var util = require('util')
		, DinamicoConf = require('./conf')
		, DinamicoUtil = require('./util')
		, dinamico = require('./dinamico');

function DinamicoTask (name, conf) {
	DinamicoTask.super_.apply(this, arguments);

	var enabled
			, path;

	this.setup = function () {
		path = name;

		if(typeof(conf) == 'boolean') {
			enabled = conf;
		} else {
			// It's object
		}

		this.require();

		return this;
	}

	this.require = function () {
		//console.log(DinamicoUtil.getRootDir());
		console.log(dinamico);
		return this;
	}

	this.register = function () {
		return this;
	}

	this.getPath = function () {
		return path;
	}

	this.isEnabled = function () {
		return enabled;
	}

	this.setup();
}

util.inherits(DinamicoTask, DinamicoConf);

module.exports = DinamicoTask;
