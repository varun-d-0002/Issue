import { NextFunction, Request, Response } from 'express'
// import { LineService } from '../services'
import { SESSION_ERROR } from '../../config'
import { AppError } from '../../utilities'
import { AuthService } from '../services'

const checkSession = (req: Request, res: Response, next: NextFunction) => {
	try {
		if (req.session.user == null) throw new AppError(SESSION_ERROR, 'session does not exist', false)
		next()
	} catch (e) {
		next(e)
	}
}
const checkLineProfile = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.headers['access-token']) {
			throw new AppError(SESSION_ERROR, 'access-token', false)
		}
		const isVerified = await AuthService.verifyAccessToken(req.headers['access-token'] as string)
		if (!isVerified) {
			throw new AppError(SESSION_ERROR, 'not verified', false)
		}
		const memberLine = await AuthService.getProfileByToken(req.headers['access-token'] as string)
		if (!memberLine) {
			throw new AppError(SESSION_ERROR, 'profile not found', false)
		}
		res.locals.memberLine = memberLine
		next()
	} catch (e) {
		next(e)
	}
}

const pathSessionCheck = (fn: CallableFunction) => (req: Request, res: Response, next: NextFunction) =>
	['/api/m/', '/api/auth', '/api/login', '/api/sess', '/api/logout', '/storage'].some((uripath) =>
		req.path.includes(uripath)
	)
		? fn(req, res, next)
		: next()

const pathLineWebhookCheck = (fn: CallableFunction) => (req: Request, res: Response, next: NextFunction) =>
	req.path.includes('/api/hooks/line') ? next() : fn(req, res, next)

const redirectHttp = (req: Request, res: Response, next: NextFunction) => {
	if (process.env.NODE_ENV != 'development' && !req.secure) {
		return res.redirect('https://' + req.headers.host + req.url)
	}
	next()
}
export default {
	checkLineProfile,
	checkSession,
	pathSessionCheck,
	pathLineWebhookCheck,
	redirectHttp
}
