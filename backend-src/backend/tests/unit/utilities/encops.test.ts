import EncUtils from '../../../utilities/encryption.util'

const sampleJwt = {
	sub: '1234567890',
	name: 'John Doe',
	iat: 1656239022
}

describe('Utilities Encryption module', () => {
	test('sign jwt', async () => {
		const data = EncUtils.signJWT(sampleJwt, 'testKeyXdPQzcxjfiogIzI6yQonBJlDQ')
		expect(data).toBe(
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNjU2MjM5MDIyfQ.rfXS6g6hRA7yWyo4MA8bWi7xNbANTVHhAFU3PPPcwQ8'
		)
	})
	test.concurrent('verify jwt', async () => {
		const jwt = EncUtils.signJWT(sampleJwt, 'testKeyXdPQzcxjfiogIzI6yQonBJlDQ')
		const data = EncUtils.verifyJWT(jwt, 'testKeyXdPQzcxjfiogIzI6yQonBJlDQ')
		expect(data).toHaveProperty('iat', 1656239022)
		expect(data).toHaveProperty('name', 'John Doe')
		expect(data).toHaveProperty('sub', '1234567890')
	})

	test.concurrent('create hash', async () => {
		const data = await EncUtils.createHash('test')
		expect(data).toHaveLength(60)
	})

	test.concurrent('compare password', async () => {
		const hash = await EncUtils.createHash('test')
		const data = await EncUtils.comparePassword('test', hash)
		expect(data).toBeTruthy()
	})

	test.concurrent('generate token', () => {
		const data = EncUtils.generateToken(32)
		expect(data).toHaveLength(32)
	})
})
