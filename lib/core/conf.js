function Conf (name, conf) {
	var name = name;
	var conf = conf;

	this.getName = function() {
		return name;
	}

	this.getConf = function() {
		return conf;
	}

}

module.exports = Conf;
