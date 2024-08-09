import type { Request, Response, NextFunction } from 'express'
import path from 'path'
import multer from 'multer'
import pwgen from 'generate-password'
import { systemConfig } from '../../config'
import { FileUtils } from '../../utilities'

const multerFileEncodingFixer = (filename: string, isArray: boolean) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (isArray && req.files) {
			const reqFiles = req.files as Record<string, Express.Multer.File[]>
			// eslint-disable-next-line security/detect-object-injection
			const images = reqFiles[filename]
			if (images && images.length > 0)
				// eslint-disable-next-line security/detect-object-injection
				(req.files as Record<string, Express.Multer.File[]>)[filename] = images.map((f) =>
					FileUtils.changeEncodingLatin1ToUTF(f)
				)
		} else if (req.file) {
			req.file = FileUtils.changeEncodingLatin1ToUTF(req.file)
		}
		next()
	}
}

const settingStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, systemConfig.PATH_FILE_UPLOAD_SETTING)
	},
	filename: (req, file, cb) => {
		cb(null, `${pwgen.generate({ length: 10, numbers: true })}${path.extname(file.originalname)}`)
	}
})
const memStorage = multer.memoryStorage()

const uploadImage = multer({
	storage: settingStorage,
	fileFilter: (req, file, cb) => {
		const fileFormat = path.extname(file.originalname)
		if (['.jpg', '.jpeg', '.png', '.svg'].includes(fileFormat)) {
			cb(null, true)
		} else {
			cb(null, false)
			return cb(new Error(`Only .png, .svg, .jpg, and .jpeg format allowed! current format ${fileFormat}`))
		}
	}
})
const uploadIco = multer({
	storage: settingStorage,
	fileFilter: (req, file, cb) => {
		if (path.extname(file.originalname) == '.ico') {
			cb(null, true)
		} else {
			cb(null, false)
			return cb(new Error(`Only .ico format allowed! ${path.extname(file.originalname)}`))
		}
	}
})

const richmenuUpload = multer({ storage: memStorage })

export default {
	multerFileEncodingFixer,
	uploadImage,
	uploadIco,
	richmenuUpload
}
