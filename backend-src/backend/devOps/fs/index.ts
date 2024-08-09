import { log } from 'console'
import { systemConfig } from '../../config'
import { FileUtils } from '../../utilities'

async function main() {
	await FileUtils.checkAndCreateDirectory(systemConfig.PATH_FILE_LOG)
	await FileUtils.checkAndCreateDirectory(systemConfig.PATH_FILE_UPLOAD)
	await FileUtils.checkAndCreateDirectory(systemConfig.PATH_FILE_UPLOAD_MEMBER)
	await FileUtils.checkAndCreateDirectory(systemConfig.PATH_FILE_UPLOAD_RICHMENU)
	await FileUtils.checkAndCreateDirectory(systemConfig.PATH_FILE_UPLOAD_SETTING)
}

main()
	// eslint-disable-next-line promise/always-return
	.then(() => {
		log('fs script finished', 'info')
		process.exit(0)
	})
	.catch((e) => {
		log({ msg: 'script error', err: e })
	})
