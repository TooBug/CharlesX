#!/usr/bin/env node

let optimist = require('optimist');
let proxy = require('../index');

optimist.usage('Usage: $0 [-p [num]]')
	.alias('p', 'port')
    .describe('p', 'Specify the port to listening for proxy.')
	.default('p', 8888)
	.alias('h', 'help')
	.describe('h', 'Show this help info.')
	.alias('s', 'hosts')
	.alias('v', 'version')
	.describe('v', 'Show Version.');


let argv = optimist.argv;
const PORT = argv.p || 8888;

let hostsArr = argv.s;
if(!hostsArr) hostsArr = [];
if(!Array.isArray(hostsArr)) hostsArr = [hostsArr];

let hosts = {};
hostsArr.forEach((hostsStr) => {
	let hostsPart = hostsStr.split('=');
	hosts[hostsPart[0].trim()] = hostsPart[1].trim();
});

if(argv.v){
	console.log('CharlesX ' + require('../package.json').version);
	return;
}

if(argv.h){
	console.log(optimist.help());
	return;
}

if(!PORT){
	console.error('[CharlesX] Please specify port by "-p 8888" or "--port 8888"');
	return;
}

proxy.init(PORT, hosts);
