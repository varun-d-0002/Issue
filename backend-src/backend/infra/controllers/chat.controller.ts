import { Request, Response, NextFunction } from 'express'
import { Transaction } from 'sequelize'
import { SYSTEM_ERROR, RESPONSE_SUCCESS } from '../../config'
import { AppError, SocketUtil } from '../../utilities'
import { getTransaction } from '../models'
import { ChatService, LineService } from '../services'

const getChat = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const memberId = parseInt(req.params.memberId)
		if (!memberId) {
			throw new AppError(SYSTEM_ERROR, 'invalid memberId', false)
		}
		const [isUpdated, chats] = await ChatService.getChat(memberId)
		if (isUpdated) SocketUtil.emitMember({ memberId })
		res.send(chats)
	} catch (e) {
		next(e)
	}
}

const replyChat = async (req: Request, res: Response, next: NextFunction) => {
	let transaction: Transaction | null = null
	try {
		const memberId = parseInt(req.params.memberId)
		const contents = req.body.contents
		if (!memberId) {
			throw new AppError(SYSTEM_ERROR, 'invalid memberId', false)
		} else if (!contents) {
			throw new AppError(SYSTEM_ERROR, 'empty contents', false)
		}
		transaction = await getTransaction()
		await ChatService.replyChat({ memberId, contents }, { sendMessage: LineService.sendMessage }, transaction)
		await transaction.commit()
		SocketUtil.emitChat({ memberId: memberId })
		res.sendStatus(RESPONSE_SUCCESS)
	} catch (e) {
		if (transaction != null) await transaction.rollback()
		next(e)
	}
}
export default {
	getChat,
	replyChat
}
