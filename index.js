require('babel-register')({
	ignore: false,
	only: /charlesx\/libs/,
	presets: 'es2015',
	plugins: [
		'add-module-exports'
	]
});

var proxy = require('./libs/proxy');

module.exports = proxy;
