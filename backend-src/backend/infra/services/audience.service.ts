import { AudienceGroupStatus, AudienceGroups } from '@line/bot-sdk'
import { db } from '../models'
import { Attributes } from 'sequelize'
import type AudienceModel from '../models/audience.model'
import type { MemberService } from './index'

const createAudience = async (
	createParams: IAudienceCreate,
	methods: {
		emitAudience: (arg: { audienceGroupId: string | number }) => void
		createAudienceApi: (arg: { description: string; audiences: { id: string }[] }) => Promise<{
			audienceGroupId: string | number
			type: string
			description: string
			created: number
		}>
		browseMembers: (typeof MemberService)['browseMembers']
	}
) => {
	const audienceName = createParams.audienceName
	if (!audienceName) {
		throw new Error('audience name not provided')
	}
	const lineIds = await findMembersForAudience(createParams, { browseMembers: methods.browseMembers })
	if (lineIds.length == 0) {
		throw new Error('lineId not provided')
	}
	const members = lineIds.map((a) => ({ id: a.lineId }))
	const audienceAPI = await methods.createAudienceApi({
		description: createParams.audienceName,
		audiences: members
	})

	const audienceRemarks = ''

	await db.Audience.create({
		audienceGroupId: audienceAPI.audienceGroupId.toString(),
		description: createParams.audienceName,
		audienceCount: members.length,
		searchCondition: createParams,
		remarks: audienceRemarks
	})

	methods.emitAudience({ audienceGroupId: audienceAPI.audienceGroupId })

	return members
}
const searchAudience = async (
	searchParams: IAudienceSearch,
	methods: {
		browseMembers: (typeof MemberService)['browseMembers']
	}
) => {
	const resultCount = await findMembersForAudience(searchParams, { browseMembers: methods.browseMembers })
	return { count: resultCount.length }
}
const listAudiences = async (methods: {
	getAudiencesFromApi: (page: number, description?: string) => Promise<AudienceGroups>
}) => {
	const audiencesDB = await db.Audience.findAll({ attributes: ['audienceGroupId', 'remarks', 'searchCondition'] })
	const audiencesAPI = await methods.getAudiencesFromApi(1)
	const result: (Attributes<AudienceModel> & { status: AudienceGroupStatus; created: number })[] = []
	audiencesDB.forEach((aDB) => {
		const aAPI = audiencesAPI.find((aud) => aud.audienceGroupId.toString() == aDB.audienceGroupId)
		if (aAPI != undefined) {
			result.push({
				audienceGroupId: aAPI.audienceGroupId.toString(),
				description: aAPI.description,
				status: aAPI.status,
				audienceCount: aAPI.audienceCount,
				created: aAPI.created,
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				//@ts-ignore
				expireTimestamp: aAPI.expireTimestamp,
				searchCondition: aDB.searchCondition,
				remarks: aDB.remarks
			})
		}
	})
	return result
}

const deleteAudience = async (
	arg: { audienceGroupId: string },
	methods: { deleteAudienceGroupApi: (arg: string) => Promise<any> }
) => {
	await methods.deleteAudienceGroupApi(arg.audienceGroupId)
	await db.Audience.destroy({ where: { audienceGroupId: arg.audienceGroupId } })
	return
}

const findMembersForAudience = async (
	searchParams: IAudienceSearch,
	methods: {
		browseMembers: (typeof MemberService)['browseMembers']
	}
) => {
	const result = await methods.browseMembers(searchParams as any, {
		getType: 'audience',
		isPaginated: false
	})
	return result.rows
}
export default {
	createAudience,
	searchAudience,
	listAudiences,
	deleteAudience
}
