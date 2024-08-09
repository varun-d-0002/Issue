import SystemSettingModel from '../../../infra/models/systemSetting.model'
import { getSequelize } from '../../../infra/models'

describe('System Setting Service', () => {
	const OLD_ENV = process.env
	const testLogo = 'test-logo.png'
	const testFavicon = 'test-favicon.png'

	beforeAll(async () => {
		await getSequelize().sync({ force: true })
		await SystemSettingModel.create({
			name: 'logo',
			label: 'ロゴ',
			valueString: testLogo
		})
		await SystemSettingModel.create({
			name: 'favicon',
			label: 'ファビコン',
			valueString: testFavicon
		})
		await SystemSettingModel.bulkCreate([
			{
				name: 'stringSettingTest',
				label: 'string setting test',
				valueString: 'this is a test',
				accessCategory: 0
			},
			{ name: 'numberSettingTest', label: 'number setting test', valueNumber: 123123123, accessCategory: 0 },
			{ name: 'flagSettingTest', label: 'flag setting test', valueFlag: true, accessCategory: 0 }
		])
	})
	beforeEach(async () => {
		jest.resetModules() // Most important - it clears the cache
		process.env = { ...OLD_ENV }
	})
	afterAll(async () => {
		await SystemSettingModel.truncate()
		process.env = OLD_ENV
		await getSequelize().close()
	})

	test('get logo', async () => {
		const logo = await SystemSettingModel.findLogo()
		expect(logo).toBe(testLogo)
	})

	test('get favicon', async () => {
		const favicon = await SystemSettingModel.findFavicon()
		expect(favicon).toBe(testFavicon)
	})

	test('get public settings', async () => {
		const settings = await SystemSettingModel.findPublicSettings()
		expect(settings).toMatchObject({
			stringSettingTest: { label: 'string setting test', valueString: 'this is a test' },
			numberSettingTest: { label: 'number setting test', valueNumber: 123123123 },
			flagSettingTest: { label: 'flag setting test', valueFlag: true },
			logo: { label: 'ロゴ', valueString: testLogo },
			favicon: { label: 'ファビコン', valueString: testFavicon }
		})
	})
})
