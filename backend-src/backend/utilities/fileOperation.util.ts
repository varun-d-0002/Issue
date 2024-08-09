/* eslint-disable security/detect-non-literal-fs-filename */
import fs from 'fs'
import fsPromises = fs.promises
import readline from 'readline'
import writeLog from './logger.util'

const checkAndCreateDirectory = async (dirPath: string) => {
	const stat = await fsPromises.stat(dirPath).catch((e) => {
		if (e.code !== 'ENOENT') throw e
		return { isDirectory: () => false }
	})
	if (stat.isDirectory() === false) await fsPromises.mkdir(dirPath, { recursive: true })
	return await fsPromises.stat(dirPath)
}

const deleteFile = async (filepath: string) =>
	fsPromises.unlink(filepath).catch((err) => writeLog({ msg: 'err deleteFile', err: err }, 'error'))

const saveBufferToFile = async (buffer: Buffer, filepath: string, filename: string) =>
	fsPromises
		.writeFile(filepath, buffer)
		.then(() => filename)
		.catch((e) => {
			writeLog({ msg: 'err saveBufferToFile', datatype: typeof buffer, filepath: filepath, e: e }, 'error')
			return filename
		})

const readBufferFromFile = async (filepath: string) => fsPromises.readFile(filepath)

const changeEncodingLatin1ToUTF = (f: Express.Multer.File) => {
	// eslint-disable-next-line no-control-regex
	if (!/[^\u0000-\u00ff]/.test(f.originalname)) {
		f.originalname = Buffer.from(f.originalname, 'latin1').toString('utf8')
	}
	return f
}

const makeFileReader = (filepath: string) => {
	if (!fs.existsSync(filepath)) {
		throw new Error(`File not found: ${filepath}`)
	}

	const fileStream = fs.createReadStream(filepath, { encoding: 'utf8' })

	return readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	})
}

export default {
	checkAndCreateDirectory,
	deleteFile,
	saveBufferToFile,
	readBufferFromFile,
	changeEncodingLatin1ToUTF,
	makeFileReader
}
