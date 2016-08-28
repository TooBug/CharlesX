#!/usr/bin/env node

let optimist = require('optimist');
let proxy = require('../index');

optimist.usage('Usage: $0 [-p [num]]')
	.alias('p', 'port')
    .describe('p', 'Specify the port to listening for proxy.')
	.default('p', 8888)
	.alias('h', 'help')
	.describe('h', 'Show this help info.')
	.alias('t', 'throttle')
	.alias('s', 'hosts')
	.alias('v', 'version')
	.describe('v', 'Show Version.');


// 端口
let argv = optimist.argv;
const PORT = argv.p || 8888;

// hosts列表
let hostsArr = argv.s;
if(!hostsArr) hostsArr = [];
if(!Array.isArray(hostsArr)) hostsArr = [hostsArr];

let hosts = {};
hostsArr.forEach((hostsStr) => {
	let hostsPart = hostsStr.split('=');
	hosts[hostsPart[0].trim()] = hostsPart[1].trim();
});

// 限速

// 限速表，下载和上传不对称，单位kbps(bit)
let throttleMap = {
	'offline' : [0,0],
	'2ggprs': [50/8,20/8],
	'2gedge': [500/8,200/8],
	'3g': [1000/8, 500/8],
	'4g': [4000/8, 3000/8],
	'adsl4': [4000/8, 500/8],
	'adsl20': [20000/8, 500/8],
	'lan': [100000/8, 100000/8]
};

let throttle;
if(argv.t){
	throttle = throttleMap[argv.t];
	if(!throttle){
		throttle = argv.t.split(',');
	}
}

// 版本号
if(argv.v){
	console.log('CharlesX ' + require('../package.json').version);
	return;
}

// 帮助
if(argv.h){
	console.log(optimist.help());
	return;
}

if(!PORT){
	console.error('[CharlesX] Please specify port by "-p 8888" or "--port 8888"');
	return;
}

proxy.init(PORT, hosts, throttle);
