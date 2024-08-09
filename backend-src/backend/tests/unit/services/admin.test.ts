import ManagerModel from '../../../infra/models/manager.model'
import { getSequelize } from '../../../infra/models'

describe('Admin Service', () => {
	const OLD_ENV = process.env
	let testManagerId: number
	const testUsername = 'findManagerTest'
	const testPassword = 'findManagerTestPw'
	const testEmail = 'test@email.com'
	beforeAll(async () => {
		await getSequelize().sync({ force: true })
		const manager = await ManagerModel.create({
			username: testUsername,
			pwhash: testPassword,
			recoveryMail: testEmail,
			authLevel: 'master',
			isActivated: true
		})
		testManagerId = manager.managerId
	})
	beforeEach(async () => {
		// await ManagerModel.truncate()
		jest.resetModules() // Most important - it clears the cache
		process.env = { ...OLD_ENV } // Make a copy
	})
	afterAll(async () => {
		await ManagerModel.truncate()
		process.env = OLD_ENV // Restore old environment
		await getSequelize().close()
	})

	test('find manager', async () => {
		const data = await ManagerModel.getManager(testManagerId)
		expect(data?.username).toEqual(testUsername)
		return
	})

	test('find manager by username', async () => {
		const data = await ManagerModel.findManagerByUsername(testUsername)
		expect(data?.username).toEqual(testUsername)
		expect(data?.managerId).toEqual(testManagerId)
	})
})
