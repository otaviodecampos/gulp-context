var GulpDinamico = require('./dinamico')
		, instance;

module.exports = function (conf) {
	if(!instance) instance = new GulpDinamico(conf);
	return instance;
}
