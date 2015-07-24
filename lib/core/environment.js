var util = require('util')
		, Conf = require('./conf')
		, Task = require('./task');

function DinamicoEnvironment (name, conf) {
	DinamicoEnvironment.super_.apply(this, arguments);

	var tasks = {};

	this.setup = function () {
		for (var name in conf.tasks) {
			var taskconf = conf.tasks[name];
			var task = new Task(name, taskconf);

			this.addTask(task);
		}

		return this;
	}

	this.addTask = function(task) {
		if(task instanceof Task) {
			tasks[task.getName()] = task;
		} else {
			throw Error("It's not a DinamicoTask instance");
		}
	}

	this.isDefault = function() {
		return this.getConf().default == true;
	}

	this.setup();
}

util.inherits(DinamicoEnvironment, Conf);

module.exports = DinamicoEnvironment;
