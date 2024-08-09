import { NextFunction, Request, Response } from 'express'
import { ManagerService } from '../services'
import { SESSION_ERROR } from '../../config'
import { AppError } from '../../utilities'

async function checkAuthenticatedUser(req: Request, res: Response, next: NextFunction) {
	try {
		if (req.session.user) {
			const manager = await ManagerService.getManager(req.session.user.id)
			if (manager == null) throw new AppError(SESSION_ERROR, `manager ${req.session.user.id} not found`)

			res.send({
				auth: manager.authLevel,
				username: manager.username
			})
		} else {
			res.status(SESSION_ERROR).send('session does not exist')
		}
	} catch (e) {
		next(e)
	}
}

export default {
	checkAuthenticatedUser
}
