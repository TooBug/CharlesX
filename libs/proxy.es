import http from 'http'
import net from 'net'
import url from 'url'
import moment from 'moment'
import httpProxy from 'http-proxy'

export default {

	init(port, hosts = {}){

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
			let port = urlPart.port || 80;
			// proxy.web(req, res, { target: 'http://'+req.headers.host })
			proxy.web(req, res, { target: `http://${targetHost}:${port}` })
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
				pSock.pipe(res)
			}).on('error', (e) => {
				console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] <-- Error:${e.message}`)
				res.end(`CharlesX Error:${e.message}`)
			})
			res.pipe(pSock)
		})

		server.listen(port)
		console.log(`CharlesX running on port ${port}`)

	}

}

