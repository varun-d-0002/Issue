import { Op, Transaction, WhereAttributeHash } from 'sequelize'
import { db } from '../models'
import type { LineService } from './index'
import { writeLog } from '../../utilities'

const listSpectatorsByWatch = async (watch: 'member', transaction?: Transaction) => {
	let spectatorWhere: WhereAttributeHash | null = null
	switch (watch) {
		case 'member':
			spectatorWhere = { isSpectatingMember: true }
			break
		default:
			break
	}
	if (spectatorWhere == null) {
		return []
	}
	return await db.Spectator.findAll({
		where: spectatorWhere,
		attributes: ['memberId'],
		include: {
			association: db.Spectator.associations.Member,
			attributes: ['lineId']
		},
		transaction
	})
}

const listSpectatorCandidates = async (transaction?: Transaction) => {
	const existingSpectators = await db.Spectator.findAll({
		attributes: ['spectatorId', 'memberId'],
		transaction
	})
	const spectatorsWhere: WhereAttributeHash = {
		isFriends: true
	}
	if (existingSpectators.length > 0) {
		spectatorsWhere.memberId = { [Op.notIn]: existingSpectators.map((s) => s.memberId) }
	}
	const spectators = await db.Member.findAll({
		where: spectatorsWhere,
		attributes: ['memberId', 'displayName', 'picUrl'],
		transaction
	})
	return spectators
}

const listSpectators = async (transaction?: Transaction) =>
	db.Spectator.findAll({
		attributes: { exclude: ['createdAt', 'updatedAt'] },
		include: {
			association: db.Spectator.associations.Member,
			attributes: [
				'memberId',
				'memberCode',
				'displayName',
				'picUrl',
				'firstName',
				'lastName',
				'firstNameKana',
				'lastNameKana',
				'telephone'
			]
		},
		transaction
	})

const bulkEditSpectators = async (members: { memberId: number }[], transaction?: Transaction) => {
	const membersDB = await db.Member.findAll({
		attributes: ['memberId'],
		where: {
			memberId: { [Op.in]: members.map((m) => m.memberId as number) },
			isFriends: true
		},
		transaction
	})
	if (membersDB.length == 0) {
		return []
	}
	const newSpectators = members.filter((m) => membersDB.some((mDB) => m.memberId == mDB.memberId))
	return await db.Spectator.bulkCreate(newSpectators, {
		fields: ['memberId', 'isSpectatingMember'],
		updateOnDuplicate: ['isSpectatingMember'],
		transaction
	})
}

const deleteSpectator = async (spectatorId: number, transaction?: Transaction) =>
	db.Spectator.destroy({ where: { spectatorId }, transaction })

const notifySpectatorsByWatch = async (
	arg: {
		member: { lastName: string; firstName: string; telephone: string }
	},
	methods: {
		sendMulticastMessage: (typeof LineService)['sendMulticastMessage']
	},
	transaction?: Transaction
) => {
	const member = arg.member
	const replacerName = new RegExp(/\[NAME\]/, 'gm')
	const replacerTelephone = new RegExp(/\[TEL\]/, 'gm')
	const spectators = await listSpectatorsByWatch('member', transaction)
	if (spectators.length == 0) return

	const spectatorLineIds = spectators.map((spectator) => spectator.Member.lineId)
	const watchMessageTemplate = await db.SystemSetting.findSettings('watchMemberTemplate')
	if (!watchMessageTemplate || !watchMessageTemplate.valueString || !watchMessageTemplate.valueString.length) return

	let watchMessage = watchMessageTemplate.valueString.replace(replacerName, `${member.lastName} ${member.firstName}`)
	watchMessage = watchMessage.replace(replacerTelephone, member.telephone)
	await methods
		.sendMulticastMessage(spectatorLineIds, watchMessage)
		.catch((err) => writeLog(`failed to send multicast message member watch ${err.message}`, 'info'))
}

export default {
	listSpectatorsByWatch,
	listSpectatorCandidates,
	listSpectators,
	bulkEditSpectators,
	deleteSpectator,
	notifySpectatorsByWatch
}
