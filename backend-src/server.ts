import 'dotenv/config'
import http from 'http'
import express from 'express'
import { systemConfig } from './backend/config'
import { attachSocketServer } from './backend/infra/loaders/socket.loader'
import { getSequelize } from './backend/infra/models'
import { initializeExpress } from './backend/infra/loaders/express.loader'
import { writeLog } from './backend/utilities'

async function main() {
	await getSequelize().authenticate()

	const app = express()
	const server = http.createServer(app)
	attachSocketServer(server)
	initializeExpress(app)
	//load app
	server.listen(systemConfig.PORT)
}

main()
	.then(() => {
		// eslint-disable-next-line no-console
		if (systemConfig.ENV_TEST) console.log('server start', process.env.PORT)
		return
	})
	.catch((e) => {
		writeLog(e, 'crit')
		process.exit(1)
	})
