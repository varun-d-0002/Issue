import { NextFunction, Request, Response } from 'express'
import { RESPONSE_SUCCESS, RICHMENU_TYPES, SYSTEM_ERROR } from '../../config'
import { AppError } from '../../utilities'
import { LineService, RichmenuService } from '../services'

async function listRichmenu(req: Request, res: Response, next: NextFunction) {
	try {
		const richmenus = await RichmenuService.listRichmenu()
		res.send(richmenus)
	} catch (e) {
		next(e)
	}
}
async function setRichmenuProps(req: Request, res: Response, next: NextFunction) {
	const { rmType, isDisplayed }: { rmType: richmenuType; isDisplayed?: boolean } = req.body
	try {
		if (!rmType || !RICHMENU_TYPES.includes(rmType)) {
			throw new AppError(SYSTEM_ERROR, `invalid rmType ${rmType}`, false)
		}
		if (isDisplayed == undefined) {
			throw new AppError(SYSTEM_ERROR, 'invalid parameters', false)
		}
		await RichmenuService.setRichmenuProps(
			{ rmType, isDisplayed },
			{
				deleteDefaultRichmenu: LineService.deleteDefaultRichmenu,
				linkRichmenuToMultipleUsers: LineService.linkRichmenuToMultipleUsers,
				setDefaultRichmenu: LineService.setDefaultRichmenu,
				unlinkRichmenusFromMultipleUsers: LineService.unlinkRichmenuFromMultipleUsers
			}
		)
		res.sendStatus(RESPONSE_SUCCESS)
	} catch (e) {
		next(e)
	}
}
async function setRichmenu(req: Request, res: Response, next: NextFunction) {
	try {
		const rmType: richmenuType = req.body.type
		const link1 = req.body.link1 ?? null
		const link2 = req.body.link2 ?? null
		const link3 = req.body.link3 ?? null
		const link4 = req.body.link4 ?? null
		const link5 = req.body.link5 ?? null
		const link6 = req.body.link6 ?? null
		const isDisplayed = req.body.isDisplayed === 'true'
		const picUrl = req.file
		if (!rmType || !RICHMENU_TYPES.includes(rmType)) {
			throw new AppError(SYSTEM_ERROR, `invalid rmType ${rmType}`, false)
		}
		if (!(link1 || link2 || link3 || link4 || link5 || link6)) {
			throw new AppError(SYSTEM_ERROR, 'invalid parameters', false)
		}
		await RichmenuService.setRichmenu(
			{
				rmType,
				richmenuLinks: { link1, link2, link3, link4, link5, link6 },
				isDisplayed,
				picUrl: picUrl
			},
			{
				createRichmenuApi: LineService.createRichMenu,
				setRichmenuImage: LineService.setRichMenuImage,
				setDefaultRichmenu: LineService.setDefaultRichmenu,
				linkRichmenuToMultipleUsers: LineService.linkRichmenuToMultipleUsers,
				deleteRichmenu: LineService.deleteRichMenu
			}
		)
		res.sendStatus(RESPONSE_SUCCESS)
	} catch (e) {
		next(e)
	}
}
async function deleteRichmenu(req: Request, res: Response, next: NextFunction) {
	try {
		const rmType: richmenuType = req.body.type
		if (!rmType || !RICHMENU_TYPES.includes(rmType)) {
			throw new AppError(SYSTEM_ERROR, `invalid rmType ${rmType}`, false)
		}
		await RichmenuService.deleteRichmenu({ rmType }, { deleteRichmenuApi: LineService.deleteRichMenu })
		res.sendStatus(RESPONSE_SUCCESS)
	} catch (e) {
		next(e)
	}
}
export default {
	listRichmenu,
	setRichmenuProps,
	setRichmenu,
	deleteRichmenu
}
