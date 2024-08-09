import type { NextFunction, Response, Request } from 'express'
import { RESPONSE_SUCCESS } from '../../config'
import { writeLog } from '../../utilities'

async function verifyPos(req: Request, res: Response, next: NextFunction) {
	try {
		writeLog({ src: 'verifyPosMiddleware', body: req.body, headers: req.headers }, 'error')
		res.sendStatus(RESPONSE_SUCCESS)
	} catch (e) {
		next(e)
	}
}
export default {
	// verifyEc,
	verifyPos
}
