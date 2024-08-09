import { getSequelize } from '../../../infra/models'
import ChatModel from '../../../infra/models/chat.model'
import MemberModel from '../../../infra/models/member.model'
import MemberPreferenceModel from '../../../infra/models/memberPreference.model'
import MemberService from '../../../infra/services/member.service'
// describe('MemberService browse members', () => {
// 	const OLD_ENV = process.env
// 	beforeAll(async () => {
// 		await getSequelize().sync()
// 	})
// 	afterAll(async () => {
// 		process.env = OLD_ENV
// 		await getSequelize().close()
// 	})
// 	// Positive Test Case
// 	test('browseMembers should return members with valid search parameters', async () => {
// 		const searchParams = { name: 'John', age: 25 }
// 		const pagination = { page: 1, perPage: 10, sortKey: 'name', sort: 'asc' }
// 		const result = await MemberService.browseMembers({ ...searchParams, ...pagination })
// 		expect(result.count).toEqual(0)
// 		expect(result.rows.length).toEqual(0)
// 	})

// 	// 	// Negative Test Case
// 	test('browseMembers should return empty array when no members found', async () => {
// 		const searchParams = { name: 'Invalid Name', age: 25 }
// 		const pagination = { page: 1, perPage: 10, sortKey: 'name', sort: 'asc' }
// 		const result = await MemberService.browseMembers({ ...searchParams, ...pagination })
// 		expect(result.count).toEqual(0)
// 		expect(result.rows.length).toEqual(0)
// 		expect(result.pagination).toHaveProperty('page')
// 		expect(result.pagination).toHaveProperty('perPage')
// 		expect(result.pagination).toHaveProperty('sort')
// 		expect(result.pagination).toHaveProperty('sortKey')
// 	})

// 	// 	// Error Test Case
// 	// test('browseMembers should throw an error when invalid search parameters are provided', async () => {
// 	// 	const searchParams = { invalidParam: 'Invalid Value' }
// 	// 	const pagination = { page: 1, perPage: 10, sortKey: 'name', sort: 'asc' }
// 	// 	await expect(MemberService.browseMembers({ ...searchParams, ...pagination })).rejects.toThrow()
// 	// })

// 	// 	// Edge Test Case
// 	test('browseMembers should return all members when pagination perPage is greater than total count', async () => {
// 		const searchParams = { name: 'John', age: 25 }
// 		const pagination = { page: 1, perPage: 1000, sortKey: 'name', sort: 'asc' }
// 		const result = await MemberService.browseMembers({ ...searchParams, ...pagination })
// 		expect(result.count).toEqual(0)
// 		expect(result.rows.length).toEqual(0)
// 		expect(result.pagination).toEqual({
// 			page: 1,
// 			perPage: 20,
// 			sort: 'asc',
// 			sortKey: 'name'
// 		})
// 	})
// })
describe('Find Members', () => {
	const OLD_ENV = process.env
	beforeAll(async () => {
		process.env = { ...OLD_ENV }
		// console.warn(getSequelize().config)
		await getSequelize().sync({ force: true })
		const member = await MemberModel.create({
			memberId: 1,
			memberCode: '123',
			lineId: '123123123',
			displayName: 'test line member',
			isFriends: false,
			picUrl: 'test pic url',
			firstName: 'test first name',
			lastName: 'test last name',
			firstNameKana: 'test first name kana',
			lastNameKana: 'test last name kana',
			dateOfBirth: new Date('2000-01-01'),
			gender: 'male',
			kakeruPoint: 0,
			telephone: '0123456789',
			postalCode: '46000003',
			prefecture: '愛知県',
			city: '名古屋',
			address: '中区錦',
			activeUntil: new Date('2024-01-01'),
			memberSince: new Date('2023-01-01'),
			remarks: 'testing'
		})
		await MemberPreferenceModel.bulkCreate([
			{ memberId: member.memberId, preferenceType: 'serviceType', choice: '売りたい' },
			{ memberId: member.memberId, preferenceType: 'serviceType', choice: '買いたい' },
			{ memberId: member.memberId, preferenceType: 'serviceType', choice: '借りたい' },
			{ memberId: member.memberId, preferenceType: 'serviceArea', choice: '小牧市' },
			{ memberId: member.memberId, preferenceType: 'serviceArea', choice: '豊山町' },
			{ memberId: member.memberId, preferenceType: 'serviceArea', choice: '名古屋市' },
			{ memberId: member.memberId, preferenceType: 'serviceArea', choice: '北名古屋市' },
			{ memberId: member.memberId, preferenceType: 'serviceArea', choice: '岩倉市' }
		])
	})
	afterAll(async () => {
		process.env = OLD_ENV
		await MemberModel.truncate()
		await getSequelize().close()
	})
	test('find member', async () => {
		const result = await MemberService.getMember({ memberId: 1 })
		expect(result).not.toBeNull()
		expect(result).toHaveProperty('memberId')
	})
})
// describe('Member Service validate member search parameters', () => {
// 	const OLD_ENV = process.env
// 	beforeAll(async () => {
// 		process.env = { ...OLD_ENV }
// 	})
// 	afterAll(async () => {
// 		process.env = OLD_ENV
// 	})
// 	// Positive Test Case
// 	test('validateMemberSearchParameters should return searchParams and pagination object', () => {
// 		const arg = {
// 			isFriends: 'true',
// 			memberSinceMin: '2021-01-01',
// 			memberSinceMax: '2021-12-31',
// 			telephone: '1234567890',
// 			address: '123 Main St',
// 			name: 'John Doe',
// 			page: '1',
// 			perPage: '10',
// 			sort: 'asc' as const,
// 			sortKey: 'memberId'
// 		}
// 		const result = MemberService.validateMemberSearchParameters(arg)
// 		expect(result).toHaveProperty('searchParams')
// 		expect(result).toHaveProperty('pagination')
// 	})

// 	// Edge Test Case
// 	test('validateMemberSearchParameters should return default values for pagination if perPage is less than 1', () => {
// 		const arg = {
// 			isFriends: 'true',
// 			memberSinceMin: '2021-01-01',
// 			memberSinceMax: '2021-12-31',
// 			telephone: '1234567890',
// 			address: '123 Main St',
// 			name: 'John Doe',
// 			page: '1',
// 			perPage: '0',
// 			sort: 'asc' as const,
// 			sortKey: 'memberId'
// 		}
// 		const result = MemberService.validateMemberSearchParameters(arg)
// 		expect(result.pagination.page).toBe(1)
// 		expect(result.pagination.perPage).toBe(20)
// 		expect(result.pagination.sort).toBe('asc')
// 		expect(result.pagination.sortKey).toBe('memberId')
// 	})

// 	// Edge Test Case
// 	test('validateMemberSearchParameters should return default values for pagination if perPage is greater than 20', () => {
// 		const arg = {
// 			isFriends: 'true',
// 			memberSinceMin: '2021-01-01',
// 			memberSinceMax: '2021-12-31',
// 			telephone: '1234567890',
// 			address: '123 Main St',
// 			name: 'John Doe',
// 			page: '1',
// 			perPage: '21',
// 			sort: 'asc' as const,
// 			sortKey: 'memberId'
// 		}
// 		const result = MemberService.validateMemberSearchParameters(arg)
// 		expect(result.pagination.perPage).toBe(20)
// 	})

// 	// Edge Test Case
// 	test('validateMemberSearchParameters should return default values for pagination if sortKey is not in sortKeys array', () => {
// 		const arg = {
// 			isFriends: 'true',
// 			memberSinceMin: '2021-01-01',
// 			memberSinceMax: '2021-12-31',
// 			telephone: '1234567890',
// 			address: '123 Main St',
// 			name: 'John Doe',
// 			page: '1',
// 			perPage: '10',
// 			sort: 'asc' as const,
// 			sortKey: 'invalidKey'
// 		}
// 		const result = MemberService.validateMemberSearchParameters(arg)
// 		expect(result.pagination.sortKey).toBe('memberId')
// 	})
// })
