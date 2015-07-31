var util = require('util')
		, Conf = require('./conf')
		, Task = require('./task')
		, Dinamico = require('./dinamico');

function DinamicoEnvironment (name, conf, parsers) {
	DinamicoEnvironment.super_.apply(this, arguments);

	var tasks = {}
		, params
		, dinamico = Dinamico.getInstance();

	this.build = function () {
			this.setup();
			this.register();

			return this;
	}

	this.setup = function () {

		if(!this.getTasksDir()) {
			this.getConf().tasksDir = '';
		}

		var params = JSON.parse(JSON.stringify(dinamico.getConf().params));

		for(var i = 0, len = parsers.length; i < len; i++) {
			var parser = parsers[i];
			params = parser.call(this, params);
		}

		for (var name in conf.tasks) {
			var taskconf = conf.tasks[name];
			var task = new Task(name, taskconf, params);

			this.addTask(task);
		}

		for(var name in tasks) {
			var task = tasks[name];
			if(task.isEnabled()) {
				task.build();
			}
		}

		return this;
	}

	this.addTask = function (task) {
		if(task instanceof Task) {
			task.setEnvironment(this);
			tasks[task.getName()] = task;
		} else {
			throw Error("It's not a DinamicoTask instance");
		}
	}

	this.getTask = function (name) {
		return tasks[name];
	}

	this.getDependencies = function () {
		var dependencies = [];

		for(var task in tasks) {
			task = tasks[task];
			if(task.isEnabled()) {
				dependencies.push(task.getGulpName());
			}
		}

		return dependencies;
	}

	this.register = function () {
		dinamico.task(this.getName(), this.getDependencies());
	}

	this.isDefault = function () {
		return this.getConf().default == true;
	}

	this.getTasksDir = function () {
		return this.getConf().tasksDir;
	}

	this.isWatch = function () {
		return this.getConf().watch == true;
	}

}

util.inherits(DinamicoEnvironment, Conf);

module.exports = DinamicoEnvironment;
