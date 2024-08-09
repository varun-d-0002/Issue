import { NextFunction, Request, Response } from 'express'
import { db } from '../models'
import { AppError, FileUtils, SocketUtil } from '../../utilities'
import { RESPONSE_SUCCESS, SYSTEM_ERROR, systemConfig } from '../../config'
import path from 'path'
import type SystemSettingModel from '../models/systemSetting.model'
import type { CreationAttributes } from 'sequelize'

async function getPublicSettings(req: Request, res: Response, next: NextFunction) {
	try {
		const publicSettings = await db.SystemSetting.findPublicSettings()
		res.send(publicSettings)
	} catch (e) {
		next(e)
	}
}

async function getSystemSettings(req: Request, res: Response, next: NextFunction) {
	try {
		const settings = await db.SystemSetting.getSettings()
		res.send(settings)
	} catch (e) {
		next(e)
	}
}
async function getSystemSetting(req: Request, res: Response, next: NextFunction) {
	try {
		const key = req.params.key
		if (!key) {
			throw new AppError(SYSTEM_ERROR, 'invalid key', false)
		}
		const setting = await db.SystemSetting.findSettings(key)
		res.send(setting)
	} catch (e) {
		next(e)
	}
}
async function setBulkSystemSettings(req: Request, res: Response, next: NextFunction) {
	try {
		const settings = req.body.settings as (CreationAttributes<SystemSettingModel> & { isPublic?: boolean })[]
		if (!settings || settings.length == 0) {
			throw new AppError(SYSTEM_ERROR, 'invalid parameters')
		}
		//TODO: validate input
		await db.SystemSetting.updateSettingsInBulk(
			settings.map((setting) => ({
				...setting,
				accessCategory:
					setting.isPublic === true ? db.SystemSetting.PUBLIC_ACCESS : db.SystemSetting.ADMIN_ACCESS
			}))
		)
		SocketUtil.emitSystemSetting({ keys: settings.map((s) => s.name) })
		res.sendStatus(RESPONSE_SUCCESS)
	} catch (e) {
		next(e)
	}
}
async function setSystemSettings(req: Request, res: Response, next: NextFunction) {
	try {
		const key = req.params.key
		if (!key) {
			throw new AppError(SYSTEM_ERROR, 'invalid key', false)
		}
		const { label, valueFlag, valueString, valueNumber, isPublic } = req.body as {
			label: string
			valueFlag?: boolean
			valueString?: string
			valueNumber?: number
			isPublic?: boolean
		}
		const settingAccessLevel = isPublic === true ? db.SystemSetting.PUBLIC_ACCESS : db.SystemSetting.ADMIN_ACCESS
		let setting = await db.SystemSetting.findByPk(key)
		if (setting == null) {
			setting = await db.SystemSetting.create({
				name: key,
				label: label,
				valueFlag: valueFlag,
				valueString: valueString,
				valueNumber: valueNumber,
				accessCategory: settingAccessLevel
			})
		} else {
			setting.set({
				label: label,
				valueFlag: valueFlag,
				valueString: valueString,
				valueNumber: valueNumber,
				accessCategory: settingAccessLevel
			})
			if (setting.changed()) {
				setting = await setting.save()
			}
		}
		SocketUtil.emitSystemSetting({ keys: [key] })
		res.sendStatus(RESPONSE_SUCCESS)
	} catch (e) {
		next(e)
	}
}
async function deleteSettings(req: Request, res: Response, next: NextFunction) {
	try {
		const key = req.params.key
		if (!key) {
			throw new AppError(SYSTEM_ERROR, 'invalid key', false)
		}
		await db.SystemSetting.deleteSettings(key)
		SocketUtil.emitSystemSetting({ keys: [key] })
		res.sendStatus(RESPONSE_SUCCESS)
	} catch (e) {
		next(e)
	}
}
async function getFavicon(req: Request, res: Response, next: NextFunction) {
	try {
		const favicon = await db.SystemSetting.findFavicon()
		res.send(favicon)
	} catch (e) {
		next(e)
	}
}
async function setFavicon(req: Request, res: Response, next: NextFunction) {
	try {
		if (!req.file || !req.file.filename) {
			throw new AppError(SYSTEM_ERROR, 'no favicon file', false)
		}
		if (!req.file.filename.endsWith('.ico')) {
			await FileUtils.deleteFile(path.join(systemConfig.PATH_FILE_UPLOAD_SETTING, req.file.filename)).then(() => {
				throw new AppError(SYSTEM_ERROR, `wrong file format ${req.file?.filename}`)
			})
		}
		let favicon = await db.SystemSetting.findOne({ where: { name: 'favicon' } })
		if (favicon == null) {
			favicon = await db.SystemSetting.createSettings({
				name: 'favicon',
				label: 'ファビコン',
				valueString: req.file.filename
			})
		} else {
			if (favicon.valueString != null) {
				await FileUtils.deleteFile(path.join(systemConfig.PATH_FILE_UPLOAD_SETTING, favicon.valueString))
			}
			await favicon.update({
				label: 'ファビコン',
				valueString: req.file.filename
			})
		}
		SocketUtil.emitFavicon({ favicon: req.file.filename })
		res.sendStatus(RESPONSE_SUCCESS)
	} catch (e) {
		next(e)
	}
}
async function getLogo(req: Request, res: Response, next: NextFunction) {
	try {
		const logo = await db.SystemSetting.findLogo()
		res.send(logo)
	} catch (e) {
		next(e)
	}
}
async function setLogo(req: Request, res: Response, next: NextFunction) {
	try {
		if (!req.file || !req.file.filename) {
			throw new AppError(SYSTEM_ERROR, 'no logo file', false)
		}
		let logo = await db.SystemSetting.findOne({ where: { name: 'logo' } })
		if (logo == null) {
			logo = await db.SystemSetting.createSettings({
				name: 'logo',
				label: 'ロゴ',
				valueString: req.file.filename
			})
		} else {
			if (logo.valueString != null) {
				await FileUtils.deleteFile(path.join(systemConfig.PATH_FILE_UPLOAD_SETTING, logo.valueString))
			}
			await logo.update({
				label: 'ロゴ',
				valueString: req.file.filename
			})
		}
		SocketUtil.emitLogo({ logo: req.file.filename })
		res.sendStatus(RESPONSE_SUCCESS)
	} catch (e) {
		next(e)
	}
}
async function getStorePic(req: Request, res: Response, next: NextFunction) {
	try {
		const storePic = await db.SystemSetting.findStorePic()
		res.send(storePic)
	} catch (e) {
		next(e)
	}
}
async function setStorePic(req: Request, res: Response, next: NextFunction) {
	try {
		if (!req.file || !req.file.filename) {
			throw new AppError(SYSTEM_ERROR, 'no store pic file', false)
		}
		let storePic = await db.SystemSetting.findOne({ where: { name: 'storePic' } })
		if (storePic == null) {
			storePic = await db.SystemSetting.createSettings({
				name: 'storePic',
				label: '店舗画像',
				valueString: req.file.filename
			})
		} else {
			if (storePic.valueString != null) {
				await FileUtils.deleteFile(path.join(systemConfig.PATH_FILE_UPLOAD_SETTING, storePic.valueString))
			}
			await storePic.update({ label: '店舗画像', valueString: req.file.filename })
		}
		SocketUtil.emitStorePic({ storePic: req.file.filename })
		res.sendStatus(RESPONSE_SUCCESS)
	} catch (e) {
		next(e)
	}
}

export default {
	getPublicSettings,
	getSystemSettings,
	getSystemSetting,
	setBulkSystemSettings,
	setSystemSettings,
	deleteSettings,
	getFavicon,
	setFavicon,
	getLogo,
	setLogo,
	getStorePic,
	setStorePic
}
