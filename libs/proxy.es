import http from 'http'
import net from 'net'
import url from 'url'
import moment from 'moment'
import httpProxy from 'http-proxy'
import Throttle from 'throttle'

export default {

	init(port, hosts = {}, throttle = []){

		if(!throttle[0]){
			throttle[0] = Infinity
			throttle[1] = Infinity
		}else{
			console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Speed limit: ${throttle.join(',')}`);
		}

		let resThrottle = new Throttle(+throttle[0] * 1024)
		let reqThrottle = new Throttle(+throttle[1] * 1024)

		let proxy = httpProxy.createProxyServer({})
		let server = http.createServer()

		let currentRes;
		
		proxy.on('error', function(e) {
			if(currentRes){
				currentRes.statusCode = 500;
				currentRes.end(`CharlesX Error:${e.message}`);
			}
			console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] :( Error:${e.message}`)
		})

		proxy.on('proxyReq', function (proxyReq, req, res) {
			proxyReq.setHeader('host', req.headers.host)
		})

		proxy.on('proxyRes', function (proxyRes, req, res) {
			console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] <-- ${res.statusCode} ${req.url}`)
		})

		// HTTP
		server.on('request', (req, res) => {

			console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] --> ${req.method} ${req.url}`)
			currentRes = res;

			let urlPart = url.parse('http://' + req.headers.host)
			let targetHost = urlPart.hostname
			if(hosts[urlPart.hostname]){
				targetHost = hosts[urlPart.hostname]
				console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] --> rewrite ${urlPart.hostname} to ${targetHost}`)
			}
			// proxy.web(req, res, { target: 'http://'+req.headers.host })
			proxy.web(req, res, { target: `http://${targetHost}:${urlPart.port}` })
		}).on('error', (e) => {
			console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] <-- Error:${e.message}`)
			res.end(`CharlesX Error:${e.message}`)
		})

		// HTTPS
		server.on('connect', (req, res) => {

			console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] --> ${req.method} ${req.url}`)
			let urlPart = url.parse('http://' + req.url)
			let targetHost = urlPart.hostname
			if(hosts[urlPart.hostname]){
				targetHost = hosts[urlPart.hostname]
				console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] --> rewrite ${urlPart.hostname} to ${targetHost}`)
			}

			let pSock = net.connect(urlPart.port, targetHost, () => {
				res.write('HTTP/1.1 200 Connection Established\r\n\r\n')
				pSock.pipe(resThrottle).pipe(res)
			}).on('error', (e) => {
				console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] <-- Error:${e.message}`)
				res.end(`CharlesX Error:${e.message}`)
			})
			res.pipe(reqThrottle).pipe(pSock)
		})

		server.listen(port)
		console.log(`CharlesX running on port ${port}`)

	}

}

