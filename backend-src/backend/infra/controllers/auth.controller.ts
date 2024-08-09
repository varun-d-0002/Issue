import { NextFunction, Request, Response } from 'express'
import { systemConfig, PERMISSION_ERROR, RESPONSE_SUCCESS, SESSION_ERROR } from '../../config'
import { AppError, EncUtils, writeLog } from '../../utilities'
import { AuthService, ManagerService } from '../services'
import { Admin } from '../../app/admin'

async function login(req: Request, res: Response, next: NextFunction) {
	try {
		await Admin.login(req.body, {
			validateParams: AuthService.validateAuthenticationParams,
			findManager: ManagerService.findManagerByUsername,
			authenticateManager: EncUtils.comparePassword,
			setupSession: (manager) => {
				req.session.user = {
					id: manager.managerId,
					role: 10,
					expires: 86400
				}
				res.cookie(systemConfig.SESS_NAME as string, manager.managerId, { maxAge: 86400 })
			},
			authError: (msg) => new AppError(PERMISSION_ERROR, msg, false)
		})
		res.sendStatus(RESPONSE_SUCCESS)
	} catch (e) {
		next(e)
	}
}

async function logout(req: Request, res: Response, next: NextFunction) {
	try {
		req.session?.destroy((err: Error) => {
			err?.toString ? writeLog(err.toString(), 'error') : null
		})
		res.clearCookie(systemConfig.SESS_SEC as string)
		res.sendStatus(RESPONSE_SUCCESS)
	} catch (e) {
		next(e)
	}
}

async function getAuthenticatedAdmin(req: Request, res: Response, next: NextFunction) {
	try {
		const result = await Admin.getAuthenticatedAdmin(
			{
				managerId: req.session?.user?.id
			},
			{
				getManager: ManagerService.getManager,
				sessionError: (msg) => new AppError(SESSION_ERROR, msg, false)
			}
		)
		res.send(result)
	} catch (e) {
		next(e)
	}
}

export default {
	getAuthenticatedAdmin,
	login,
	logout
}
