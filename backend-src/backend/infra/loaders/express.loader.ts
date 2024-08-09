import path from 'path'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { LINE_SIGNATURE_HTTP_HEADER_NAME } from '@line/bot-sdk'
import { systemConfig } from '../../config'
import apiRouter from '../routes'
import type { Application } from 'express'
import { AuthMiddleware, ErrorMiddleware, SessionMiddleware } from '../middlewares'
import Demo from '../../infra/routes/Demo'

export function initializeExpress(app: Application) {
	//cors
	const corsOrigins = systemConfig.ENV_TEST
		? systemConfig.NGROK_URI
			? ['http://localhost:3000', systemConfig.NGROK_URI]
			: ['http://localhost:3000']
		: [systemConfig.SITE_URI, 'https://status-check.testweb-demo.com']

	const corsOptions = {
		allowedHeaders: [
			'Origin',
			'X-Requested-With',
			'Content-Type',
			'Accept',
			'X-Access-Token',
			'Authorization',
			'access-token',
			'Kakeru-Token',
			LINE_SIGNATURE_HTTP_HEADER_NAME,
		],
		credentials: true,
		methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
		origin: corsOrigins,
		preflightContinue: false,
	}

	app.enable('trust proxy')
	app.disable('x-powered-by')
	app.use(cors(corsOptions))
	app.use(AuthMiddleware.pathLineWebhookCheck(helmet({ contentSecurityPolicy: false })))
	app.use(AuthMiddleware.pathLineWebhookCheck(express.json()))
	app.use(AuthMiddleware.pathLineWebhookCheck(express.urlencoded({ extended: true })))

	app.use(AuthMiddleware.redirectHttp)
	app.use('/managers', Demo) // route it set
	app.use(AuthMiddleware.pathSessionCheck(SessionMiddleware))
	app.use(express.static(path.join(process.cwd(), 'frontend', 'build')))
	app.use('/api', apiRouter, ErrorMiddleware.errorLogger, ErrorMiddleware.errorResponder)
	app.use(
		'/storage',
		AuthMiddleware.checkSession,
		express.static(path.join(process.cwd(), 'storage')),
		ErrorMiddleware.errorLogger,
		ErrorMiddleware.errorResponder,
	)
	app.use(express.static(path.join(process.cwd(), 'public')))
	app.get('/*', (req, res) => {
		res.sendFile(path.join(process.cwd(), 'frontend', 'build', 'index.html'), function (err) {
			if (err) {
				res.status(500).send(err)
			}
		})
	})
	return app
}
