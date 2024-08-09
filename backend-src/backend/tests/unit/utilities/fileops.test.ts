import fs from 'fs'
import FileUtils from '../../../utilities/fileOperation.util'

describe('Utilities File operation module', () => {
	const testBasePath = `${__dirname}/file_ops_test`
	beforeAll(async () => {
		await fs.promises.mkdir(`${__dirname}/file_ops_test`)
	})
	afterAll(async () => {
		await fs.promises.rmdir(`${__dirname}/file_ops_test`)
	})

	test('create directory', async () => {
		const testPath = `${testBasePath}/create_directory`
		const fstat = await FileUtils.checkAndCreateDirectory(testPath)
		expect(fstat).toHaveProperty('isDirectory')
		expect(fstat.isDirectory()).toBe(true)
		await fs.promises.rmdir(testPath)
	})

	test.concurrent('save buffer to file', async () => {
		const testBuffer = Buffer.from('test')
		const testPath = `${testBasePath}/save_buffer_to_file`
		const fstat = await FileUtils.checkAndCreateDirectory(testPath)
		expect(fstat).toHaveProperty('isDirectory')
		expect(fstat.isDirectory()).toBe(true)
		let testFilename = 'test.txt'
		testFilename = await FileUtils.saveBufferToFile(testBuffer, testPath + '/' + testFilename, testFilename)
		expect(testFilename).toBe(testFilename)
		await fs.promises.rm(testPath + '/test.txt')
		await fs.promises.rmdir(testPath)
	})

	test.concurrent('delete file', async () => {
		const testBuffer = Buffer.from('test')
		const testPath = `${testBasePath}/delete_file`
		const fstat = await FileUtils.checkAndCreateDirectory(testPath)
		expect(fstat).toHaveProperty('isDirectory')
		expect(fstat.isDirectory()).toBe(true)
		let testFilename = 'test.txt'
		testFilename = await FileUtils.saveBufferToFile(testBuffer, testPath + '/' + testFilename, testFilename)
		expect(testFilename).toBe(testFilename)
		await FileUtils.deleteFile(testPath + '/' + testFilename)
		const testFileExists = await fs.promises
			.access(testPath + '/test.txt')
			.then(() => true)
			.catch(() => false)
		expect(testFileExists).toBe(false)
		await fs.promises.rmdir(testPath)
	})
})
