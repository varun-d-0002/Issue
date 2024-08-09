import socketio from 'socket.io'
import type { Server as HttpServer } from 'http'
import type { Server as SocketServer } from 'socket.io'
import { systemConfig } from '../../config'

const iooptions = {
	serveClient: systemConfig.ENV_TEST ? true : false,
	path: '/socket.io',
	cors: {
		origin: systemConfig.ENV_TEST
			? process.env.NGROK_URI
				? ['http://localhost:3000', process.env.NGROK_URI]
				: ['http://localhost:3000']
			: systemConfig.SITE_URI
	}
}

const socketIO: SocketServer = new socketio.Server(iooptions)
function attachSocketServer(httpServer: HttpServer) {
	socketIO.attach(httpServer)
}

export { socketIO, attachSocketServer }
