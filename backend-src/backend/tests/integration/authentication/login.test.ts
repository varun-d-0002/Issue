import { Admin } from '../../../app/admin'

describe('Admin', () => {
	const OLD_ENV = process.env
	beforeEach(() => {
		jest.resetModules() // Most important - it clears the cache
		process.env = { ...OLD_ENV } // Make a copy
	})
	afterAll(() => {
		process.env = OLD_ENV // Restore old environment
	})

	test('login', async () => {
		const testEmail = 'test@email.com'
		const testUsername = 'testLoginIDE2E'
		const testPassword = 'testLoginPWE2E'
		const testHash = 'testLoginPwHashE2E'
		const manager = {
			managerId: 1,
			username: testUsername,
			pwhash: testHash,
			recoveryMail: testEmail,
			authLevel: 'master',
			isActivated: true
		}

		const managerData = await Admin.login(
			{
				username: manager.username,
				password: testPassword
			},
			{
				validateParams: ({ username, password }) => {
					expect(username).toBe(manager.username)
					expect(password).toBe(testPassword)
					return { username, password }
				},
				findManager: async (username) => {
					expect(username).toBe(manager.username)
					return Promise.resolve({
						managerId: 1,
						pwhash: testHash
					})
				},
				authenticateManager: async (password, hash) => {
					expect(password).toBe(testPassword)
					expect(hash).toBe(testHash)
					return Promise.resolve(true)
				},
				setupSession: (data) => {
					expect(data).toHaveProperty('managerId')
					expect(data.managerId).toEqual(manager.managerId)
				},
				authError: (msg) => {
					expect(msg).toBeCalledTimes(0)
					return new Error(msg)
				}
			}
		)
		expect(managerData).toMatchObject({
			managerId: manager.managerId
		})
	})
})
