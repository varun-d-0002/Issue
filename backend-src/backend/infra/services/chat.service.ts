import { col, CreationAttributes, Transaction } from 'sequelize'
import { SYSTEM_ERROR } from '../../config'
import { db } from '../models'
import type ChatModel from '../models/chat.model'
import type MemberModel from '../models/member.model'
import { AppError, CommonUtil } from '../../utilities'

const createChatFromMember = async (
	{
		member,
		contents,
		contentType,
		source
	}: { member: MemberModel; contents: string; contentType: chatContentType; source: 'user' },
	transaction?: Transaction
) => {
	let messages: CreationAttributes<ChatModel>[] = []
	const textMessageMaxLength = 1000
	if (contentType == 'text' && contents.length > textMessageMaxLength) {
		const segments = CommonUtil.divideString(contents, textMessageMaxLength)
		messages = segments.map((segment) => ({ memberId: member.memberId, contents: segment, contentType, source }))
		const bulkCreateBatchSize = 50
		if (messages.length == 1) {
			await db.Chat.create(messages[0], { transaction })
		} else if (messages.length > 1) {
			for (let i = 0; i < messages.length; i += bulkCreateBatchSize) {
				const batch = messages.slice(i, i + bulkCreateBatchSize)
				await db.Chat.bulkCreate(batch, { transaction })
			}
		}
		await member.increment('unreadCount', { transaction })
		return
	} else {
		return await Promise.all([
			db.Chat.create({ memberId: member.memberId, contents, contentType, source }, { transaction }),
			member.increment('unreadCount', { transaction })
		])
	}
}

const getChat = async (memberId: number, transaction?: Transaction) => {
	const affectedCount = await db.Member.update(
		{ unreadCount: 0 },
		{
			where: { memberId },
			transaction
		}
	)
	const chats = await db.Chat.findAll({
		where: { memberId },
		order: [[col('chatId'), 'asc']],
		transaction
	})
	return [affectedCount, chats]
}

const replyChat = async (
	arg: {
		memberId: number
		contents: string
	},
	methods: { sendMessage: (arg: { lineId: string; message: string }) => Promise<void> },
	transaction?: Transaction
) => {
	const member = await db.Member.findByPk(arg.memberId, { transaction })

	if (member == null || member.lineId == null)
		throw new AppError(SYSTEM_ERROR, `member ${arg.memberId} does not exist or no lineId`, false)

	await Promise.all([
		methods.sendMessage({ lineId: member.lineId as string, message: arg.contents }),
		db.Chat.create(
			{ memberId: member.memberId, contents: arg.contents, contentType: 'text', source: 'manager' },
			{ transaction }
		)
	])
}

export default { createChatFromMember, getChat, replyChat }
