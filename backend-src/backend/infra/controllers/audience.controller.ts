import { NextFunction, Request, Response } from 'express'
import { RESPONSE_SUCCESS, SYSTEM_ERROR } from '../../config'
import { AppError, SocketUtil } from '../../utilities'
import { AudienceService, LineService, MemberService } from '../services'

const listAudiences = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const audiences = await AudienceService.listAudiences({ getAudiencesFromApi: LineService.listAudiencesApi })
		res.send(audiences)
	} catch (e) {
		next(e)
	}
}

const searchAudience = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const searchParams = req.body
		const result = await AudienceService.searchAudience(searchParams, {
			browseMembers: MemberService.browseMembers
		})
		res.send(result)
	} catch (e) {
		next(e)
	}
}

const createAudience = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.body.audienceName) {
			throw new AppError(SYSTEM_ERROR, 'invalid parameters')
		}
		await AudienceService.createAudience(req.body, {
			createAudienceApi: LineService.createAudienceApi,
			emitAudience: SocketUtil.emitAudience,
			browseMembers: MemberService.browseMembers
		})
		res.sendStatus(RESPONSE_SUCCESS)
	} catch (e) {
		next(e)
	}
}

const deleteAudience = async (req: Request, res: Response, next: NextFunction) => {
	const audienceGroupId = req.params.audienceGroupId
	try {
		if (audienceGroupId == null) {
			throw new Error('invalid audienceGroupId')
		} else {
			await AudienceService.deleteAudience(
				{ audienceGroupId },
				{ deleteAudienceGroupApi: LineService.deleteAudienceApi }
			)
			SocketUtil.emitAudience({ audienceGroupId })
			res.sendStatus(RESPONSE_SUCCESS)
		}
	} catch (e) {
		next(e)
	}
}
export default {
	listAudiences,
	searchAudience,
	createAudience,
	deleteAudience
}
