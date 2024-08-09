import { NextFunction, Request, Response } from 'express'
import { MemberService, LineService, RichmenuService, SpectatorService } from '../services'
import { CONFLICT_ERROR, RESPONSE_SUCCESS, SYSTEM_ERROR, lineConfig } from '../../config'
import { SocketUtil, AppError, CommonUtil } from '../../utilities'
import { getTransaction } from '../models'
import moment from 'moment'

async function updatePersonalInfo(req: Request, res: Response, next: NextFunction) {
	const transaction = await getTransaction()
	try {
		const lineProfile = res.locals.memberLine as lineProfile
		const [member, isNewRecord] = await MemberService.updatePersonalInfo(
			lineProfile,
			req.body,
			{
				getRichmenuByType: RichmenuService.getRichmenuByType,
				linkRichMenuToUser: LineService.linkRichMenuToUser
			},
			transaction
		)
		if (isNewRecord) {
			await SpectatorService.notifySpectatorsByWatch(
				{
					member: {
						firstName: member.firstName ?? '',
						lastName: member.lastName ?? '',
						telephone: member.telephone ?? ''
					}
				},
				{
					sendMulticastMessage: LineService.sendMulticastMessage
				}
			)
		}
		SocketUtil.emitMember({ memberId: member.memberId })
		await transaction.commit()
		res.sendStatus(RESPONSE_SUCCESS)
	} catch (e) {
		if (transaction != null) await transaction.rollback()
		next(e)
	}
}
async function getPersonalInfo(req: Request, res: Response, next: NextFunction) {
	try {
		const member = await MemberService.getMember({ lineId: res.locals.memberLine.userId })
		if (member == null) {
			const cLine = await LineService.getProfile(res.locals.memberLine.userId)
			if (cLine != null) {
				await MemberService.createMember({
					displayName: cLine.displayName,
					lineId: cLine.userId,
					picUrl: cLine.pictureUrl,
					isFriends: true,
					curRM: 'defaultRM'
				})
			}
			return res.send({
				picUrl: res.locals.memberLine.pictureUrl
			})
		}
		const lineProfile = await LineService.getProfile(res.locals.memberLine.userId)
		const isFriends = lineProfile != null
		if (member.isFriends != isFriends) {
			await member.update({ isFriends: isFriends })
		}
		res.send({
			memberId: member.memberId,
			memberCode: member.memberCode,
			memberSince: member.memberSince,
			picUrl: member.picUrl,
			firstName: member.firstName,
			lastName: member.lastName,
			firstNameKana: member.firstNameKana,
			lastNameKana: member.lastNameKana,
			gender: member.gender,
			postalCode: member.postalCode,
			dateOfBirth: member.dateOfBirth,
			prefecture: member.prefecture,
			city: member.city,
			address: member.address,
			building: member.building,
			telephone: member.telephone,
			preferenceTypes: member.preferenceTypes?.map((pT: { choice: string }) => pT.choice),
			preferenceAreas: member.preferenceAreas?.map((pA: { choice: string }) => pA.choice)
		})
	} catch (e) {
		next(e)
	}
}
async function browseMembers(req: Request, res: Response, next: NextFunction) {
	try {
		const { count, pagination, rows } = await MemberService.browseMembers(req.query as any, {
			getType: 'browse',
			isPaginated: true
		})
		res.send({
			count,
			rows,
			...pagination
		})
	} catch (e) {
		next(e)
	}
}
async function listMembers(req: Request, res: Response, next: NextFunction) {
	try {
		const memberList = await MemberService.listMembers()
		res.send(memberList)
	} catch (e) {
		next(e)
	}
}
async function getMember(req: Request, res: Response, next: NextFunction) {
	try {
		const memberId = parseInt(req.params.memberId)
		if (!memberId || isNaN(memberId))
			throw new AppError(SYSTEM_ERROR, 'Invalid parameter: ' + req.params.memberId, false)
		const member = await MemberService.getMember({ memberId })
		const memberData = member?.toJSON() as any
		memberData.preferenceAreas = memberData.preferenceAreas.map((pA: { choice: string }) => pA.choice)
		memberData.preferenceTypes = memberData.preferenceTypes.map((pT: { choice: string }) => pT.choice)
		res.send(memberData)
	} catch (e) {
		next(e)
	}
}
async function getMemberByBarCode(req: Request, res: Response, next: NextFunction) {
	try {
		const memberCode = req.body.memberCode
		if (!memberCode) {
			throw new AppError(CONFLICT_ERROR, 'invalid member code')
		}
		const member = await MemberService.getMember({ memberCode })
		res.send(member)
	} catch (e) {
		next(e)
	}
}
async function updateMember(req: Request, res: Response, next: NextFunction) {
	try {
		const { activeUntil, remarks, memberSince, kakeruPoint, kakeruPointIsAdd, visitDate } = req.body
		const memberId = parseInt(req.params.memberId)
		if (!memberId || isNaN(memberId)) throw new AppError(SYSTEM_ERROR, 'invalid parameters', false)
		const member = await MemberService.getMember({ memberId })
		if (member == null) {
			throw new AppError(SYSTEM_ERROR, 'invalid member', false)
		}
		if (activeUntil != undefined && moment(activeUntil).isValid()) {
			member.set({ activeUntil: activeUntil })
		}
		if (remarks) {
			member.set({ remarks: remarks })
		}
		if (memberSince) {
			member.set({ memberSince: memberSince })
		}
		let lastVisit
		if (visitDate) {
			lastVisit = await member.createVisit({ visitDate: new Date() })
		}
		if (kakeruPoint != null && !isNaN(kakeruPoint) && kakeruPointIsAdd != null) {
			const updateKakeruPoints = member.addOrDeductPoint(parseInt(kakeruPoint), kakeruPointIsAdd == true)
			member.set({ kakeruPoint: updateKakeruPoints })
			await member.createPoint({
				visitId: lastVisit?.memberVisitId || null,
				point: kakeruPoint * (kakeruPointIsAdd ? 1 : -1)
			})
		}
		if (member.changed()) {
			await member.save()
		}
		SocketUtil.emitMember({ memberId })
		res.sendStatus(RESPONSE_SUCCESS)
	} catch (e) {
		next(e)
	}
}
async function deleteMember(req: Request, res: Response, next: NextFunction) {
	try {
		const memberId = parseInt(req.params.memberId)
		if (isNaN(memberId)) {
			throw new AppError(SYSTEM_ERROR, 'invalid parameter', true)
		}
		await MemberService.deleteMember(memberId, { unlinkRichmenuFromUser: LineService.unlinkRichMenuFromUser })
		SocketUtil.emitMember({ memberId })
		res.sendStatus(RESPONSE_SUCCESS)
	} catch (e) {
		next(e)
	}
}
async function syncFollowers(req: Request, res: Response, next: NextFunction) {
	try {
		let fetchSize =
			typeof req.body.fetchSize === 'string'
				? parseInt(req.body.fetchSize)
				: req.body.fetchSize ?? lineConfig.SYNC_FOLLOWERS_DEFAULT_FETCH_SIZE
		// clamping batchSize between min, max
		fetchSize = CommonUtil.clampNumber(
			fetchSize,
			lineConfig.SYNC_FOLLOWERS_MIN_FETCH_SIZE,
			lineConfig.SYNC_FOLLOWERS_MAX_FETCH_SIZE
		)
		const iterations = await MemberService.syncFollowers(fetchSize, undefined)
		res.send(`syncFollowers finished with ${iterations} iterations`)
	} catch (e) {
		next(e)
	}
}
export default {
	updatePersonalInfo,
	getPersonalInfo,
	browseMembers,
	listMembers,
	getMember,
	getMemberByBarCode,
	updateMember,
	deleteMember,
	syncFollowers
}
