import { Attributes, BindOrReplacements, CreationAttributes, QueryTypes, Transaction, col } from 'sequelize'
import { db, getSequelize } from '../models'
import type MemberModel from '../models/member.model'
import { AppError, CommonUtil } from '../../utilities'
import { SERVICE_AREAS, SERVICE_TYPES, SYSTEM_ERROR, lineConfig } from '../../config'
import moment from 'moment'
import LineService from './line.service'
import type { RichmenuService } from './'

function validateMemberUpdateParams(arg: Partial<createMemberParams>) {
	if (
		!arg.firstName ||
		!arg.firstNameKana ||
		!arg.lastName ||
		!arg.lastNameKana ||
		!arg.serviceAreas ||
		(!arg.serviceAreas.length && !Array.isArray(arg.serviceAreas)) ||
		!arg.serviceTypes ||
		(!arg.serviceTypes.length && !Array.isArray(arg.serviceTypes))
	) {
		throw new AppError(SYSTEM_ERROR, 'invalid parameters', false)
	}
	return arg as createMemberParams
}
async function updatePersonalInfo(
	lineProfile: lineProfile,
	params: Omit<createMemberParams, 'lineId' | 'picUrl' | 'displayName'>,
	methods: {
		getRichmenuByType: (typeof RichmenuService)['getRichmenuByType']
		linkRichMenuToUser: (typeof LineService)['linkRichMenuToUser']
	},
	transaction?: Transaction
): Promise<[MemberModel, boolean]> {
	validateMemberUpdateParams(params)
	const member = await db.Member.findMember(lineProfile, transaction)
	const isNewMember = member.memberCode == null
	await member.reload({
		attributes: { exclude: ['lineId'] },
		include: [
			{ association: db.Member.associations.points, attributes: { exclude: ['pointId', 'memberId'] } },
			{ association: db.Member.associations.preferenceAreas, attributes: ['choice'], required: false },
			{ association: db.Member.associations.preferenceTypes, attributes: ['choice'], required: false },
			{ association: db.Member.associations.visits, attributes: ['memberVisitId', 'memberId'] }
		],
		transaction
	})
	const memberCode = `45${moment().format('YYYYMMDD')}${member.memberId.toString().padStart(10, '0')}`
	if (member.memberCode == null) member.set({ memberCode: memberCode })
	if (member.memberSince == null) member.set({ memberSince: new Date() })
	if (params.firstName !== undefined) member.set({ firstName: params.firstName })
	if (params.lastName !== undefined) member.set({ lastName: params.lastName })
	if (params.firstNameKana !== undefined) member.set({ firstNameKana: params.firstNameKana })
	if (params.lastNameKana !== undefined) member.set({ lastNameKana: params.lastNameKana })
	if (params.gender !== undefined) member.set({ gender: params.gender })
	if (params.dateOfBirth !== undefined) member.set({ dateOfBirth: params.dateOfBirth as any })
	if (params.postalCode !== undefined) member.set({ postalCode: params.postalCode })
	if (params.prefecture !== undefined) member.set({ prefecture: params.prefecture })
	if (params.address !== undefined) member.set({ address: params.address })
	if (params.building !== undefined) member.set({ building: params.building })
	if (params.telephone !== undefined) member.set({ telephone: params.telephone })
	if (member.memberCode == null) member.set({ memberCode: memberCode })
	const memberRichmenuId = (await methods.getRichmenuByType('memberRM'))?.richmenuId
	if (member.curRM !== 'memberRM' && memberRichmenuId) {
		member.set({ curRM: 'memberRM' })
		await methods.linkRichMenuToUser({ userId: member.lineId, richmenuId: memberRichmenuId })
	}
	if (member.changed()) {
		await member.save({ transaction })
	}
	const currentAreaChoices = member.preferenceAreas?.map((a) => a.choice) ?? []
	if (!CommonUtil.areArraysEqual<string>(currentAreaChoices, params.serviceAreas)) {
		if (currentAreaChoices.length > 0) {
			await db.MemberPreference.destroy({
				where: { memberId: member.memberId, preferenceType: db.MemberPreference.SCOPES.area },
				transaction
			})
		}
		if (params.serviceAreas.length > 0) {
			await db.MemberPreference.bulkCreate(
				params.serviceAreas.map((vP) => ({
					preferenceType: db.MemberPreference.SCOPES.area,
					choice: vP,
					memberId: member.memberId
				})),
				{ transaction }
			)
		}
	}
	const currentTypeChoices = member.preferenceTypes?.map((a) => a.choice) ?? []
	if (!CommonUtil.areArraysEqual<string>(currentTypeChoices, params.serviceTypes)) {
		if (currentTypeChoices.length > 0) {
			await db.MemberPreference.destroy({
				where: { memberId: member.memberId, preferenceType: db.MemberPreference.SCOPES.type },
				transaction
			})
		}
		if (params.serviceTypes.length > 0) {
			await db.MemberPreference.bulkCreate(
				params.serviceTypes.map((vP) => ({
					preferenceType: db.MemberPreference.SCOPES.type,
					choice: vP,
					memberId: member.memberId
				})),
				{ transaction }
			)
		}
	}
	return [member, isNewMember]
}
const getBrowseRowProperties = (type: 'browse' | 'audience') => {
	switch (type) {
		case 'browse':
			return `members.memberId,
members.memberCode,
members.displayName,
members.picUrl,
members.firstName,
members.lastName,
members.firstNameKana,
members.lastNameKana,
members.dateOfBirth,
members.gender,
members.postalCode,
members.prefecture,
members.city,
members.address,
members.building,
members.telephone,
members.kakeruPoint,
members.activeUntil,
members.memberSince,
members.unreadCount,
members.remarks,
members.isFriends, 
IFNULL(GROUP_CONCAT(DISTINCT serviceAreas.choice),'') AS 'preferenceAreas',
IFNULL(GROUP_CONCAT(DISTINCT serviceTypes.choice),'') AS 'preferenceTypes',
COUNT(DISTINCT visits.memberVisitId) AS countVisit, 
MAX(visits.visitDate) AS lastVisit`
		case 'audience':
			return 'members.memberId,members.lineId'
		default:
			return ''
	}
}
async function browseMembers(
	arg: searchMemberParams & IPagination,
	options: { getType: 'browse' | 'audience'; isPaginated: boolean } = { getType: 'browse', isPaginated: true }
) {
	const sortKeys = ['memberId', 'dateOfBirth', 'memberSince', 'activeUntil']
	const {
		perPage,
		page,
		sort,
		sortKey,
		isFriends,
		name,
		address,
		dateOfBirthMin,
		dateOfBirthMax,
		lastVisitMin,
		lastVisitMax,
		countVisitMin,
		countVisitMax,
		telephone,
		gender,
		activeMin,
		activeMax,
		remarks,
		serviceTypes,
		serviceAreas
	} = arg

	const memberWheres = []
	const memberHaving = []
	const bindParams: BindOrReplacements = {}
	if (options.getType == 'browse' && isFriends !== undefined) {
		memberWheres.push('isFriends = $isFriends')
		bindParams.isFriends = isFriends.length > 0 ? isFriends === '1' : false
	} else if (options.getType == 'audience') {
		memberWheres.push('isFriends = $isFriends')
		bindParams.isFriends = true
	}
	if (dateOfBirthMin && dateOfBirthMax) {
		memberWheres.push('dateOfBirth BETWEEN $dateOfBirthMin AND $dateOfBirthMax')
		bindParams.dateOfBirthMin = dateOfBirthMin
		bindParams.dateOfBirthMax = dateOfBirthMax
	} else if (dateOfBirthMax) {
		memberWheres.push('dateOfBirth >= $dateOfBirthMax')
		bindParams.dateOfBirthMax = dateOfBirthMax
	} else if (dateOfBirthMin) {
		memberWheres.push('dateOfBirth <= $dateOfBirthMin')
		bindParams.dateOfBirthMin = dateOfBirthMin
	}
	if (telephone != undefined && telephone != '') {
		memberWheres.push('telephone LIKE $telephone')
		bindParams.telephone = `%${telephone}%`
	}
	if (gender != undefined && gender != '') {
		memberWheres.push('gender = $gender')
		bindParams.gender = gender
	}
	if (remarks) {
		memberWheres.push('remarks LIKE $remarks')
		bindParams.remarks = `%${remarks}%`
	}
	if (activeMin && activeMax) {
		memberWheres.push('activeUntil BETWEEN $activeMin AND $activeMax')
		bindParams.activeMin = activeMin
		bindParams.activeMax = activeMax
	} else if (activeMin) {
		memberWheres.push('activeUntil >= $activeMin')
		bindParams.activeMin = activeMin
	} else if (activeMax) {
		memberWheres.push('activeUntil <= $activeMax')
		bindParams.activeMax = activeMax
	}
	if (address && address != '') {
		memberWheres.push(`
                                LOWER(
                                    REPLACE(
                                        CONCAT(
                                            IFNULL(postalCode, ''), 
                                            IFNULL(prefecture, ''), 
                                            IFNULL(city, ''), 
                                            IFNULL(address, ''),
                                            IFNULL(building, '')
                                        ), ' ', ''
                                    )
                                ) LIKE $address`)
		bindParams.address = `%${address.replace(/\s+/g, '').toLocaleLowerCase()}%`
	}
	if (name && name != '') {
		memberWheres.push(`
                                LOWER(
                                    CONCAT(
                                        IFNULL(lastName, ''), 
                                        IFNULL(firstName, ''),
                                        IFNULL(lastNameKana, ''), 
                                        IFNULL(firstNameKana, ''),
                                        IFNULL(displayName, '')
                                    )
                                ) LIKE $name`)
		bindParams.name = `%${name.replace(/\s+/g, '').toLocaleLowerCase()}%`
	}
	if (lastVisitMin && lastVisitMax) {
		const visitMinMoment = moment(lastVisitMin).set({ hour: 0, minute: 0, second: 0 }).toDate()
		const visitMaxMoment = moment(lastVisitMax).set({ hour: 23, minute: 59, second: 59 }).toDate()
		memberHaving.push('lastVisit BETWEEN $visitMinMoment AND $visitMaxMoment')
		bindParams.visitMinMoment = visitMinMoment
		bindParams.visitMaxMoment = visitMaxMoment
	} else if (lastVisitMin) {
		const visitMinMoment = moment(lastVisitMin).set({ hour: 0, minute: 0, second: 0 }).toDate()
		memberHaving.push('lastVisit >= $visitMinMoment')
		bindParams.visitMinMoment = visitMinMoment
	} else if (lastVisitMax) {
		const visitMaxMoment = moment(lastVisitMax).set({ hour: 23, minute: 59, second: 59 }).toDate()
		memberHaving.push('lastVisit <= $visitMaxMoment')
		bindParams.visitMaxMoment = visitMaxMoment
	}
	if (countVisitMin && countVisitMax) {
		memberHaving.push('countVisit BETWEEN $countVisitMin AND $countVisitMax')
		bindParams.countVisitMin = countVisitMin
		bindParams.countVisitMax = countVisitMax
	} else if (countVisitMin) {
		memberHaving.push('countVisit >= $countVisitMin')
		bindParams.countVisitMin = countVisitMin
	} else if (countVisitMax) {
		memberHaving.push('countVisit <= $countVisitMax')
		bindParams.countVisitMax = countVisitMax
	}
	let serviceTypeWhere = ''
	if (serviceTypes && serviceTypes.length > 0 && Array.isArray(serviceTypes)) {
		if (serviceTypes.some((serviceType) => !SERVICE_TYPES.includes(serviceType))) {
			throw new Error('invalid service type')
		}
		serviceTypeWhere = `AND serviceTypes1.choice IN (${serviceTypes.map((s) => `'${s}'`).join(',')})`
	}
	let serviceAreaWhere = ''
	if (serviceAreas && serviceAreas.length > 0 && Array.isArray(serviceAreas)) {
		if (serviceAreas.some((serviceArea) => !SERVICE_AREAS.includes(serviceArea))) {
			throw new Error('invalid service area')
		}
		serviceAreaWhere = `AND serviceAreas1.choice IN (${serviceAreas.map((s) => `'${s}'`).join(',')})`
	}
	const condition = {
		page: parseInt(page as string) || 1,
		perPage: parseInt(perPage as string) || 20,
		sort: sort == 'asc' ? 'asc' : 'desc',
		sortKey: sortKeys.includes(sortKey as string) ? sortKey : 'members.updatedAt'
	}
	const wheresSql = memberWheres.length > 0 ? `AND ${memberWheres.join(' AND ')}` : ''
	const rowProperties = getBrowseRowProperties(options.getType)
	const querySql = `SELECT ${rowProperties}
		FROM members AS members 
		LEFT JOIN memberVisits AS visits
			ON members.memberId = visits.memberId 
		${serviceTypeWhere == '' ? 'LEFT' : ''} JOIN memberPreferences AS serviceTypes1
			ON members.memberId = serviceTypes1.memberId AND serviceTypes1.preferenceType = 'serviceType' ${serviceTypeWhere}
		LEFT JOIN memberPreferences AS serviceTypes
			ON members.memberId = serviceTypes.memberId AND serviceTypes.preferenceType = 'serviceType'
		${serviceAreaWhere == '' ? 'LEFT' : ''} JOIN memberPreferences AS serviceAreas1
			ON members.memberId = serviceAreas1.memberId AND serviceAreas1.preferenceType = 'serviceArea' ${serviceAreaWhere}
		LEFT JOIN memberPreferences AS serviceAreas
			ON members.memberId = serviceAreas.memberId AND serviceAreas.preferenceType = 'serviceArea'
		WHERE members.memberId IS NOT NULL AND members.memberCode IS NOT NULL ${wheresSql}
		GROUP BY members.memberId ${memberHaving.length ? `HAVING ${memberHaving.join(' AND ')}` : ''}`
	// get total search results
	const count = await getSequelize()
		.query(`SELECT COUNT(*) as count FROM (${querySql}) as c`, {
			bind: bindParams,
			type: QueryTypes.SELECT
		})
		.then((us: any) => us[0].count)
	if (count == 0) {
		return {
			pagination: {
				perPage: condition.perPage,
				page: condition.page,
				sort: condition.sort,
				sortKey: condition.sortKey
			},
			rows: [],
			count: count
		}
	}
	let query = `${querySql} ORDER BY ${condition.sortKey} ${condition.sort} `
	if (options.getType == 'browse') {
		query = `${querySql} ORDER BY ${condition.sortKey} ${condition.sort} LIMIT ${
			(condition.page - 1) * condition.perPage
		}, ${condition.perPage}`
	}
	const data = (await getSequelize().query(query, {
		bind: bindParams,
		type: QueryTypes.SELECT
	})) as any[]
	if (options.getType == 'browse') {
		for (const row of data) {
			row.preferenceAreas = (row.preferenceAreas as string).split(',')
			row.preferenceTypes = (row.preferenceTypes as string).split(',')
		}
	}
	return {
		pagination: {
			perPage: condition.perPage,
			page: condition.page,
			sort: condition.sort,
			sortKey: condition.sortKey
		},
		rows: data as MemberModel[],
		count: count
	}
}

const listMembers = async () =>
	db.Member.findAll({
		attributes: { exclude: ['lineId'] }
	})

const getMember = async (
	memberWhere: { memberId: number } | { lineId: string } | { memberCode: string },
	transaction?: Transaction
) =>
	db.Member.findOne({
		where: memberWhere,
		attributes: { exclude: ['lineId'] },
		include: [
			{ association: db.Member.associations.points, attributes: { exclude: ['pointId', 'memberId'] } },
			{ association: db.Member.associations.preferenceAreas, attributes: ['choice'], required: false },
			{ association: db.Member.associations.preferenceTypes, attributes: ['choice'], required: false },
			{
				association: db.Member.associations.visits,
				attributes: ['visitDate'],
				separate: true,
				order: [[col('visitDate'), 'desc']]
			}
		],
		transaction
	})

const createMember = async (arg: CreationAttributes<MemberModel>, transaction?: Transaction) =>
	db.Member.create(arg, { transaction })

const updateMember = async (arg: { memberId: number; params: Attributes<MemberModel> }, transaction?: Transaction) =>
	db.Member.update(arg.params, { where: { memberId: arg.memberId }, transaction })

const deleteMember = async (
	memberId: number,
	methods: { unlinkRichmenuFromUser: (arg: { userId: string }) => Promise<void> },
	transaction?: Transaction
) => {
	const member = await db.Member.findByPk(memberId, { transaction })

	if (member == null) throw new AppError(SYSTEM_ERROR, `member ${memberId} not exist`, false)

	if (member.curRM == 'memberRM' && member.lineId) {
		await methods.unlinkRichmenuFromUser({ userId: member.lineId })
	}
	await member.destroy({ transaction })
}

const syncFollowers = async (
	fetchSize = lineConfig.SYNC_FOLLOWERS_DEFAULT_FETCH_SIZE,
	nextToken?: string,
	iterationCount = 0
): Promise<number> => {
	if (iterationCount > lineConfig.SYNC_FOLLOWERS_MAX_ITERATION_COUNT) return iterationCount
	const { next, userIds } = await LineService.getFollowerIds(nextToken, fetchSize)
	const profiles = await LineService.getBulkProfiles(userIds)
	await db.Member.bulkCreate(
		profiles.map((profile) => ({
			lineId: profile?.userId,
			displayName: profile?.displayName,
			picUrl: profile?.pictureUrl,
			isFriends: true
		})),
		{
			updateOnDuplicate: ['displayName', 'picUrl', 'isFriends'],
			fields: ['lineId', 'displayName', 'picUrl', 'isFriends']
		}
	)
	if (next) return await syncFollowers(fetchSize, next, iterationCount + 1)
	return iterationCount
}
export default {
	updatePersonalInfo,
	browseMembers,
	listMembers,
	getMember,
	createMember,
	updateMember,
	deleteMember,
	syncFollowers
}
