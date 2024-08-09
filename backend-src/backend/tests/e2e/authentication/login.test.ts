import request from 'supertest'
import express from 'express'
import { EncUtils } from '../../../utilities'
import { initializeExpress } from '../../../infra/loaders/express.loader'
import { getSequelize } from '../../../infra/models'
import ManagerModel from '../../../infra/models/manager.model'
import SessionModel from '../../../infra/models/session.model'

describe('Admin Login E2E', () => {
	const app = express()
	const OLD_ENV = process.env
	beforeAll(async () => {
		initializeExpress(app, getSequelize(), SessionModel)
		await getSequelize().sync({ force: true })
	})
	beforeEach(async () => {
		await ManagerModel.truncate()
		await SessionModel.truncate()
		jest.resetModules() // Most important - it clears the cache
		process.env = { ...OLD_ENV } // Make a copy
	})
	afterAll(async () => {
		await ManagerModel.truncate()
		await SessionModel.truncate()
		process.env = OLD_ENV // Restore old environment
		await getSequelize().close()
	})

	test('login, session, logout', async () => {
		const testEmail = 'test@email.com'
		const testUsername = 'testLogin'
		const testPassword = 'testLogin1'
		const pwhash = await EncUtils.createHash(testPassword)
		await ManagerModel.create({
			username: testUsername,
			pwhash: pwhash,
			recoveryMail: testEmail,
			authLevel: 'master',
			isActivated: true
		})

		const agent = request.agent(app)
		const loginResponse = await agent.post('/api/auth/login').send({
			username: testUsername,
			password: testPassword
		})
		expect(loginResponse.headers).toHaveProperty('set-cookie')
		expect(loginResponse.statusCode).toEqual(200)

		const session = await SessionModel.findOne()
		expect(session).toHaveProperty('sid')
		const checkSessionResultSuccess = await agent
			.get('/api/auth/sess')
			.set({ cookie: `${process.env.SESS_NAME}=${session?.sid}` })
			.catch((e) => e)
		expect(checkSessionResultSuccess.statusCode).toEqual(200)

		const logoutResult = await agent.get('/api/auth/logout')
		expect(logoutResult.statusCode).toEqual(200)
		const checkSessionResultFail = await agent
			.get('/api/auth/sess')
			.catch((err) => ({ statusCode: err.statusCode }))
		expect(checkSessionResultFail.statusCode).toEqual(403)
	})
})
