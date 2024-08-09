import { Action, Area } from '@line/bot-sdk'
import { extname } from 'path'
import path = require('path')
import { Transaction } from 'sequelize'
import {
	// RICHMENU_AREA_SMALL_HEIGHT,
	// RICHMENU_AREA_SMALL_WIDTH,
	RICHMENU_HEIGHT,
	// RICHMENU_TYPES,
	RICHMENU_WIDTH,
	systemConfig,
	SYSTEM_ERROR
} from '../../config'
import { db } from '../models'
import { AppError, FileUtils, writeLog } from '../../utilities'

const getRichmenuByType = (rmType: richmenuType, transaction?: Transaction) =>
	db.Richmenu.findOne({ where: { type: rmType }, transaction })

const listRichmenu = db.Richmenu.listRichmenu

const setRichmenuProps = async (
	params: {
		rmType: richmenuType
		isDisplayed?: boolean
	},
	methods: {
		setDefaultRichmenu: (arg: { richmenuId: string }) => Promise<any>
		deleteDefaultRichmenu: () => Promise<any>
		linkRichmenuToMultipleUsers: (arg: { richmenuId: string; userIds: string[] }) => Promise<void>
		unlinkRichmenusFromMultipleUsers: (arg: { userIds: string[] }) => Promise<void>
	},
	transaction?: Transaction
) => {
	const richmenu = await getRichmenuByType(params.rmType, transaction)
	if (richmenu == null) {
		throw new AppError(SYSTEM_ERROR, `richmenu ${params.rmType} does not exist`, false)
	}
	if (params.isDisplayed != undefined) {
		richmenu.set({ isDisplayed: params.isDisplayed })
	}
	if (richmenu.changed('isDisplayed')) {
		if (params.rmType == 'defaultRM') {
			if (richmenu.isDisplayed === true) {
				await methods.setDefaultRichmenu({ richmenuId: richmenu.richmenuId })
			} else {
				await methods.deleteDefaultRichmenu()
			}
		} else if (params.rmType == 'memberRM') {
			const existingMembers = await db.Member.findAll({
				attributes: ['lineId'],
				where: { curRM: 'memberRM' },
				transaction
			})
			if (existingMembers.length > 0) {
				//TODO: MAX 500 user IDs. need to think of a way to divide into arrays of 500 if length > 500
				if (richmenu.isDisplayed === true) {
					await methods.linkRichmenuToMultipleUsers({
						richmenuId: richmenu.richmenuId,
						userIds: existingMembers.map((eM) => eM.lineId as string)
					})
				} else {
					await methods.unlinkRichmenusFromMultipleUsers({
						userIds: existingMembers.map((eM) => eM.lineId as string)
					})
				}
			}
		}
	}
	if (richmenu.changed()) {
		await richmenu.save({ transaction })
	}
	return
}

const setRichmenu = async (
	params: {
		rmType: richmenuType
		richmenuLinks: {
			link1?: string
			link2?: string
			link3?: string
			link4?: string
			link5?: string
			link6?: string
		}
		isDisplayed: boolean
		picUrl?: Express.Multer.File
	},
	methods: {
		createRichmenuApi: (arg: { richmenu: richmenuPattern }) => Promise<string>
		setRichmenuImage: (arg: { richmenuId: string; data: Buffer }) => Promise<any>
		setDefaultRichmenu: (arg: { richmenuId: string }) => Promise<any>
		linkRichmenuToMultipleUsers: (arg: { richmenuId: string; userIds: string[] }) => Promise<void>
		deleteRichmenu: (arg: { richmenuId: string }) => Promise<void>
	}
) => {
	let rm = await getRichmenuByType(params.rmType)
	const areas = buildAreasFromLinks(params.rmType, params.richmenuLinks)
	const richmenuAttr: richmenuPattern = {
		size: { width: RICHMENU_WIDTH, height: params.rmType == 'defaultRM' ? RICHMENU_HEIGHT / 2 : RICHMENU_HEIGHT },
		selected: true,
		name: 'xkakeru_' + params.rmType,
		chatBarText: 'メニュー',
		areas: areas
	}
	if (rm == null && params.picUrl != undefined) {
		//create new richmenu with picture
		let picFileName = `xkakeru_${params.rmType}${new Date().getTime()}${extname(params.picUrl.originalname)}`
		picFileName = await FileUtils.saveBufferToFile(
			params.picUrl.buffer,
			path.join(systemConfig.PATH_FILE_UPLOAD_RICHMENU, picFileName),
			picFileName
		)
		rm = await createRichmenu(
			{
				rmType: params.rmType,
				rmAttr: richmenuAttr,
				picUrl: params.picUrl.buffer,
				isDisplayed: params.isDisplayed,
				filename: picFileName,
				links: params.richmenuLinks
			},
			{
				createRichmenuApi: methods.createRichmenuApi,
				setRichmenuImage: methods.setRichmenuImage
			}
		)
		if (params.rmType == 'defaultRM' && params.isDisplayed == true) {
			await methods.setDefaultRichmenu({ richmenuId: rm.richmenuId })
		}
	} else if (rm != null) {
		//destroy old richmenu and create new richmenu
		const oldRM = rm.richmenuId
		let picBuffer = null
		let picFileName = null
		if (params.picUrl == undefined) {
			picBuffer = await FileUtils.readBufferFromFile(path.join(systemConfig.PATH_FILE_UPLOAD_RICHMENU, rm.picUrl))
			picFileName = rm.picUrl
		} else {
			picBuffer = params.picUrl.buffer
			picFileName = `xkakeru_${params.rmType}${new Date().getTime()}${extname(params.picUrl.originalname)}`
			picFileName = await FileUtils.saveBufferToFile(
				params.picUrl.buffer,
				path.join(systemConfig.PATH_FILE_UPLOAD_RICHMENU, picFileName),
				picFileName
			)
		}
		const newRM = await createRichmenu(
			{
				rmType: params.rmType,
				rmAttr: richmenuAttr,
				picUrl: picBuffer as Buffer,
				isDisplayed: params.isDisplayed,
				filename: picFileName,
				links: params.richmenuLinks
			},
			{
				createRichmenuApi: methods.createRichmenuApi,
				setRichmenuImage: methods.setRichmenuImage
			}
		)
		//link
		if (newRM.type == 'memberRM' && newRM.isDisplayed === true) {
			const existingMembers = await db.Member.findAll({
				attributes: ['lineId'],
				where: { curRM: 'memberRM' }
			})
			if (existingMembers.length > 0) {
				//TODO: MAX 500 user IDs. need to think of a way to divide into arrays of 500 if length > 500
				await methods.linkRichmenuToMultipleUsers({
					richmenuId: newRM.richmenuId,
					userIds: existingMembers.map((eM) => eM.lineId as string)
				})
			}
		} else if (newRM.type == 'defaultRM' && newRM.isDisplayed === true) {
			await methods.setDefaultRichmenu({ richmenuId: newRM.richmenuId })
		}
		try {
			await methods.deleteRichmenu({ richmenuId: oldRM })
		} catch (e) {
			writeLog({ src: 'DeleteRichmenu', e: e }, 'debug')
		}
		await db.Richmenu.destroy({ where: { richmenuId: oldRM } })
	}
	return
}

const deleteRichmenu = async (
	arg: { rmType: richmenuType },
	methods: {
		deleteRichmenuApi: (arg: { richmenuId: string }) => Promise<void>
	}
) => {
	const rm = await getRichmenuByType(arg.rmType)
	if (rm == null) {
		return
	}
	await deleteRichmenuImageFile(rm.picUrl)
	try {
		await methods.deleteRichmenuApi({ richmenuId: rm.richmenuId })
	} catch (e) {
		writeLog({ src: 'DeleteRichmenuHandler', e: e }, 'debug')
	}
	return await rm.destroy()
}
const deleteRichmenuImageFile = async function (picUrl?: string | null) {
	if (!picUrl) return
	await FileUtils.deleteFile(path.join(systemConfig.PATH_FILE_UPLOAD_RICHMENU, picUrl)).catch((e) => {
		writeLog({ src: 'DeleteRichmenu', e: e }, 'debug')
	})
}
const createRichmenu = async (
	params: {
		rmType: richmenuType
		rmAttr: richmenuPattern
		picUrl: Buffer
		isDisplayed: boolean
		filename: string
		links: { link1?: string; link2?: string; link3?: string; link4?: string; link5?: string; link6?: string }
	},
	methods: {
		createRichmenuApi: (arg: { richmenu: richmenuPattern }) => Promise<string>
		setRichmenuImage: (arg: { richmenuId: string; data: Buffer }) => Promise<string>
	}
) => {
	const newRMId = await methods.createRichmenuApi({ richmenu: params.rmAttr })
	await methods.setRichmenuImage({ richmenuId: newRMId, data: params.picUrl })
	return await db.Richmenu.create({
		richmenuId: newRMId,
		picUrl: params.filename,
		type: params.rmType,
		pattern: JSON.stringify(params.rmAttr),
		isDisplayed: params.isDisplayed,
		link1: params.links.link1,
		link2: params.links.link2,
		link3: params.links.link3,
		link4: params.links.link4,
		link5: params.links.link5,
		link6: params.links.link6
	})
}

const buildAreasFromLinks = (
	rmType: richmenuType,
	links: {
		link1?: string
		link2?: string
		link3?: string
		link4?: string
		link5?: string
		link6?: string
	}
): { bounds: Area; action: Action<{ label?: string }> }[] => {
	const areas: { bounds: Area; action: Action<{ label?: string }> }[] = []
	if (rmType == 'defaultRM') {
		if (links.link1)
			areas.push({
				bounds: { x: 0, y: 0, width: RICHMENU_WIDTH / 3, height: RICHMENU_HEIGHT / 2 },
				action: { type: 'uri', uri: links.link1 }
			})

		if (links.link2)
			areas.push({
				bounds: { x: RICHMENU_WIDTH / 3, y: 0, width: RICHMENU_WIDTH / 3, height: RICHMENU_HEIGHT / 2 },
				action: { type: 'uri', uri: links.link2 }
			})

		if (links.link3)
			areas.push({
				bounds: { x: (RICHMENU_WIDTH / 3) * 2, y: 0, width: RICHMENU_WIDTH / 3, height: RICHMENU_HEIGHT / 2 },
				action: { type: 'uri', uri: links.link3 }
			})
		return areas
	} else if (rmType == 'memberRM') {
		if (links.link1)
			areas.push({
				bounds: { x: 0, y: 0, width: RICHMENU_WIDTH / 2, height: RICHMENU_HEIGHT / 2 },
				action: { type: 'uri', uri: links.link1 }
			})

		if (links.link2)
			areas.push({
				bounds: {
					x: RICHMENU_WIDTH / 2,
					y: 0,
					width: RICHMENU_WIDTH / 2,
					height: RICHMENU_HEIGHT / 2
				},
				action: { type: 'uri', uri: links.link2 }
			})

		if (links.link3)
			areas.push({
				bounds: {
					x: 0,
					y: RICHMENU_HEIGHT / 2,
					width: RICHMENU_WIDTH / 2,
					height: RICHMENU_HEIGHT / 2
				},
				action: { type: 'uri', uri: links.link3 }
			})

		if (links.link4)
			areas.push({
				bounds: {
					x: RICHMENU_WIDTH / 2,
					y: RICHMENU_HEIGHT / 2,
					width: RICHMENU_WIDTH / 2,
					height: RICHMENU_HEIGHT / 2
				},
				action: { type: 'uri', uri: links.link4 }
			})
		return areas
	} else {
		throw new Error('buildAreasFromLinks invalid parameters')
	}
}

export default {
	buildAreasFromLinks,
	getRichmenuByType,
	listRichmenu,
	setRichmenuProps,
	setRichmenu,
	deleteRichmenu
}
