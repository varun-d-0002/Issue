import os from 'os'
import { Router, Request, Response, NextFunction } from 'express'
import { middleware } from '@line/bot-sdk'
import { lineConfig, RESPONSE_SUCCESS, SYSTEM_ERROR } from '../../config'
import { LineWebhookController, MemberController } from '../controllers'
import { AppError } from '../../utilities'

const router = Router()

router.post(
	'/line',
	middleware({
		channelSecret: lineConfig.LINE_CHANNEL_SECRET,
		channelAccessToken: lineConfig.LINE_CHANNEL_ACCESS_TOKEN
	}),
	(req: Request, res: Response, next: NextFunction) => {
		Promise.all(req.body.events.map(LineWebhookController.handleEvent))
			.then(() => res.sendStatus(RESPONSE_SUCCESS))
			// eslint-disable-next-line promise/no-callback-in-promise
			.catch((e) => next(e))
	}
)
router.post('/dev/sync-followers', devAuthenticateMiddleware, MemberController.syncFollowers)
function devAuthenticateMiddleware(req: Request, res: Response, next: NextFunction) {
	const isAuthenticated = checkIpAddress(req, getServerIPAddress())
	if (isAuthenticated) next()
	else next(new AppError(SYSTEM_ERROR, `invalid headerForwardedFor ${req.ip}`))
}

function checkIpAddress(req: Request, serverIpAddress?: string) {
	if (serverIpAddress === undefined) throw new Error('invalid serverIpAddress')
	let ip = req.headers['x-forwarded-for']
	if (Array.isArray(ip)) ip = ip[0]

	const headerForwardedFor = req.headers['x-forwarded-for']
	if (headerForwardedFor === undefined) throw new Error('invalid headerForwardedFor')
	return (
		typeof serverIpAddress == 'string' &&
		typeof headerForwardedFor == 'string' &&
		serverIpAddress === headerForwardedFor
	)
}

/**
 * Retrieves the IPv4 address of the server.
 *
 * @return {string | undefined} The IPv4 address of the server, or undefined if not found.
 */
function getServerIPAddress(): string | undefined {
	const interfaces = os.networkInterfaces()
	for (const name of Object.keys(interfaces)) {
		const ifaceArray = interfaces[name as keyof typeof interfaces]
		if (!ifaceArray) continue
		for (const iface of ifaceArray) {
			if (iface.family === 'IPv4' && !iface.internal) return iface.address
		}
	}
	return undefined
}

export default router
