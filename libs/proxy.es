import http from 'http'
import net from 'net'
import url from 'url'
import moment from 'moment'
import httpProxy from 'http-proxy'

export default {

	init(port){

		let proxy = httpProxy.createProxyServer({})
		let server = http.createServer()
		
		proxy.on('error', function(e) {
			console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] :( Error:${e.message}`)
		})

		proxy.on('proxyRes', function (proxyRes, req, res) {
			console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] <-- ${res.statusCode} ${req.url}`)
		})

		server.on('request', (req, res) => {
			console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] --> ${req.method} ${req.url}`)
			proxy.web(req, res, { target: 'http://'+req.headers.host })
		}).on('error', (e) => {
			console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] <-- Error:${e.message}`)
			res.end(`CharlesX Error:${e.message}`)
		})

		server.on('connect', (req, res) => {

			let u = url.parse('http://' + req.url)
			console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] --> ${req.method} ${req.url}`)
			let pSock = net.connect(u.port, u.hostname, () => {
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

