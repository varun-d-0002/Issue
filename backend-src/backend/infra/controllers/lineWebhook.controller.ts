import {
	WebhookEvent,
	ReplyableEvent,
	EventMessage,
	TextEventMessage,
	ImageEventMessage,
	AudioEventMessage,
	FileEventMessage,
	VideoEventMessage
} from '@line/bot-sdk'
import sharp from 'sharp'
import { AppError, EncUtils, FileUtils, SocketUtil } from '../../utilities'
import { SYSTEM_ERROR, systemConfig } from '../../config'
import { ChatService, LineService, MemberService } from '../services'
import type MemberModel from '../models/member.model'
import { Transaction } from 'sequelize'
import moment from 'moment'
import path from 'path'

const handleWebhookEvent = async (event: WebhookEvent & ReplyableEvent) => {
	if (event.source.type === 'user') {
		if (!event.source.userId) {
			throw new AppError(SYSTEM_ERROR, 'lineId invalid')
		}
		let member = await MemberService.getMember({ lineId: event.source.userId })
		if (member == null) {
			const cLine = await LineService.getProfile(event.source.userId)
			if (cLine == null) {
				return null
			}
			member = await MemberService.createMember({
				displayName: cLine.displayName,
				lineId: cLine.userId,
				picUrl: cLine.pictureUrl,
				isFriends: true,
				curRM: 'defaultRM'
			})
		}
		switch (event.type) {
			case 'message':
				await handleMessage(event.message, member)
				break
			case 'follow':
				await handleFollow(member)
				break
			case 'unfollow':
				await handleUnfollow(member)
				break
			default:
				break
		}
	}
	return
}
const handleMessage = async (message: EventMessage, member: MemberModel) => {
	switch (message.type) {
		case 'text':
			await handleTextEventMessage(message, member)
			break
		case 'image':
			await handleImageMessage(message, member)
			break
		case 'video':
			await handleVideoMessage(message, member)
			break
		case 'file':
			await handleFileMessage(message, member)
			break
		case 'audio':
			await handleAudioMessage(message, member)
			break
		default:
			break
	}
	SocketUtil.emitChat({ memberId: member.memberId })
	return null
}
const handleTextEventMessage = async (message: TextEventMessage, member: MemberModel) =>
	ChatService.createChatFromMember({
		member: member,
		contents: message.text,
		contentType: 'text',
		source: 'user'
	})

async function handleFileMessage(message: FileEventMessage, member: MemberModel): Promise<void> {
	const YYYYMM = moment().format('YYYYMM')
	const dirPath = path.join(systemConfig.PATH_LINE_UPLOAD, YYYYMM)
	await FileUtils.checkAndCreateDirectory(dirPath)
	const { data, fileExtension } = await LineService.getMessageContentCustom(message.id, 'file')
	const fileName = EncUtils.generateToken(16) + '.' + fileExtension
	const filePath = path.join(systemConfig.PATH_LINE_UPLOAD, YYYYMM, fileName)
	await FileUtils.saveBufferToFile(data, filePath, fileName)
	await ChatService.createChatFromMember({
		member: member,
		contents: YYYYMM + '/' + fileName,
		contentType: 'file',
		source: 'user'
	})
	return
}
async function handleAudioMessage(message: AudioEventMessage, member: MemberModel): Promise<void> {
	const isReady = await LineService.getVideoAudioMessageContentStatus(message.id)
	if (!isReady) throw new Error(`could not verify media ${message.id} from ${member.memberId}`)
	const YYYYMM = moment().format('YYYYMM')
	const dirPath = path.join(systemConfig.PATH_LINE_UPLOAD, YYYYMM)
	await FileUtils.checkAndCreateDirectory(dirPath)
	const { data, fileExtension } = await LineService.getMessageContentCustom(message.id, 'audio')
	const fileName = EncUtils.generateToken(16) + '.' + fileExtension
	const filePath = path.join(systemConfig.PATH_LINE_UPLOAD, YYYYMM, fileName)
	await FileUtils.saveBufferToFile(data, filePath, fileName)
	await ChatService.createChatFromMember({
		member: member,
		contents: YYYYMM + '/' + fileName,
		contentType: 'audio',
		source: 'user'
	})
	return
}
async function handleVideoMessage(message: VideoEventMessage, member: MemberModel): Promise<void> {
	const isReady = await LineService.getVideoAudioMessageContentStatus(message.id)
	if (!isReady) throw new Error(`could not verify media ${message.id} from ${member.memberId}`)
	const YYYYMM = moment().format('YYYYMM')
	const dirPath = path.join(systemConfig.PATH_LINE_UPLOAD, YYYYMM)
	await FileUtils.checkAndCreateDirectory(dirPath)
	const { data, fileExtension } = await LineService.getMessageContentCustom(message.id, 'video')
	const fileName = EncUtils.generateToken(16) + '.' + fileExtension
	const filePath = path.join(systemConfig.PATH_LINE_UPLOAD, YYYYMM, fileName)
	await FileUtils.saveBufferToFile(data, filePath, fileName)
	await ChatService.createChatFromMember({
		member: member,
		contents: YYYYMM + '/' + fileName,
		contentType: 'video',
		source: 'user'
	})
	return
}
async function handleImageMessage(message: ImageEventMessage, member: MemberModel): Promise<void> {
	const YYYYMM = moment().format('YYYYMM')
	const dirPath = path.join(systemConfig.PATH_LINE_UPLOAD, YYYYMM)
	await FileUtils.checkAndCreateDirectory(dirPath)
	const { data, fileExtension } = await LineService.getMessageContentCustom(message.id, 'image')
	const fileName = EncUtils.generateToken(16) + '.' + fileExtension
	const filePath = path.join(systemConfig.PATH_LINE_UPLOAD, YYYYMM, fileName)
	//RESIZE
	sharp(data)
		.resize({
			width: 1024,
			height: 1024,
			fit: 'inside',
			withoutEnlargement: true
		})
		.jpeg()
		.toFile(filePath)
	await ChatService.createChatFromMember({
		member: member,
		contents: YYYYMM + '/' + fileName,
		contentType: 'image',
		source: 'user'
	})
	return
}
const handleFollow = async (member: MemberModel, transaction?: Transaction) =>
	member.update({ isFriends: true }, { transaction })

const handleUnfollow = async (member: MemberModel, transaction?: Transaction) =>
	member.update({ isFriends: false }, { transaction })

export default { handleEvent: handleWebhookEvent }
