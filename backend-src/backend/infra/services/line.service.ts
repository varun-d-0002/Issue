import { AudienceGroups, Client, Message, Profile, RichMenu, TextMessage } from '@line/bot-sdk'
import { lineConfig } from '../../config'
import { AxiosUtil, CommonUtil } from '../../utilities'
import mime from 'mime-types'
import axiosUtil from '../../utilities/axios.util'

const lineBotClient = new Client({
	channelSecret: lineConfig.LINE_CHANNEL_SECRET,
	channelAccessToken: lineConfig.LINE_CHANNEL_ACCESS_TOKEN
})

const checkIfFriends = async (lineId: string) =>
	lineBotClient
		.getProfile(lineId)
		.then((profile) => (profile ? true : false))
		.catch(() => false)

const getProfile = async (lineId: string) => lineBotClient.getProfile(lineId).catch(() => null)

const replyMessage = async (replyToken: string, messages: Message | Message[], isNotificationDisabled = false) =>
	lineBotClient.replyMessage(replyToken, messages, isNotificationDisabled)

const sendMessage = async (arg: { lineId: string; message: string }) => {
	if (arg.message.length < 1) return
	const messages = CommonUtil.divideString(arg.message, 5000)
	if (messages.length == 1) {
		await lineBotClient.pushMessage(arg.lineId, CreateTextMessage(messages[0]))
	} else {
		for (const message of messages) {
			await lineBotClient.pushMessage(arg.lineId, CreateTextMessage(message))
		}
	}
}
const sendMulticastMessage = async (lineIds: string[], message: string) => {
	if (message.length < 1) return
	const messages = CommonUtil.divideString(message, 5000)
	if (messages.length == 1) {
		await lineBotClient.multicast(lineIds, CreateTextMessage(messages[0]))
	} else {
		for (const message of messages) {
			await lineBotClient.multicast(lineIds, CreateTextMessage(message))
		}
	}
}

/**
 * Asynchronous function to retrieve bot follower IDs.
 *
 * @param {string} nextToken - Optional parameter for pagination token
 * @param {number} limit - Optional parameter to limit the number of results
 * @return {Promise<{ userIds: string[]; next: string }>} A promise that resolves to an object containing user IDs and a pagination token
 */
const getFollowerIds = async (nextToken?: string, limit = 1000) =>
	axiosUtil
		.requestHttp<{ userIds: string[]; next: string }>({
			url: 'https://api.line.me/v2/bot/followers/ids',
			params: { limit: limit, start: nextToken },
			headers: { Authorization: 'Bearer ' + lineConfig.LINE_CHANNEL_ACCESS_TOKEN }
		})
		.then((response) => response.data)
const getBulkProfiles = async (userIds: string[]) =>
	Promise.all(userIds.map(getProfile)).then((results) => results.filter((profile) => profile !== null) as Profile[])

// const CreateFlexText = (t: string, wrap = true, align: 'start' | 'center' | 'end' = 'start'): FlexMessage => {
// 	return {
// 		type: 'flex',
// 		altText: t,
// 		contents: {
// 			type: 'bubble',
// 			direction: 'ltr',
// 			body: {
// 				type: 'box',
// 				layout: 'vertical',
// 				contents: [{ type: 'text', text: t, align: align, wrap: wrap }]
// 			}
// 		}
// 	}
// }
const CreateTextMessage = (t: string): TextMessage => {
	return {
		type: 'text',
		text: t
	}
}
const createRichMenu = (arg: { richmenu: RichMenu }) => lineBotClient.createRichMenu(arg.richmenu)

const setDefaultRichmenu = (arg: { richmenuId: string }) => lineBotClient.setDefaultRichMenu(arg.richmenuId)

const linkRichMenuToUser = (arg: { userId: string; richmenuId: string }) =>
	lineBotClient.linkRichMenuToUser(arg.userId, arg.richmenuId)

const linkRichmenuToMultipleUsers = (arg: { richmenuId: string; userIds: string[] }) =>
	lineBotClient.linkRichMenuToMultipleUsers(arg.richmenuId, arg.userIds)

const unlinkRichMenuFromUser = (arg: { userId: string }) => lineBotClient.unlinkRichMenuFromUser(arg.userId)

const unlinkRichmenuFromMultipleUsers = (arg: { userIds: string[] }) =>
	lineBotClient.unlinkRichMenusFromMultipleUsers(arg.userIds)

const setRichMenuImage = (arg: { richmenuId: string; data: Buffer }) =>
	lineBotClient.setRichMenuImage(arg.richmenuId, arg.data)

const deleteDefaultRichmenu = () => lineBotClient.deleteDefaultRichMenu()

const deleteRichMenu = (arg: { richmenuId: string }) => lineBotClient.deleteRichMenu(arg.richmenuId)

const listAudiencesApi = async (page = 1, description?: string): Promise<AudienceGroups> => {
	const fragment = await lineBotClient.getAudienceGroups(page, description, undefined, 40, undefined, false)
	if (fragment.hasNextPage) {
		return fragment.audienceGroups.concat(await listAudiencesApi(page + 1))
	} else {
		return fragment.audienceGroups
	}
}
const createAudienceApi = (arg: {
	description: string
	isIfaAudience?: boolean
	audiences?: {
		id: string
	}[]
	uploadDescription?: string
}) => lineBotClient.createUploadAudienceGroup(arg)

const deleteAudienceApi = (arg: string) => lineBotClient.deleteAudienceGroup(arg)

const getMessageContent = (messageId: string) => lineBotClient.getMessageContent(messageId)
const getMessageContentCustom = async (
	messageId: string,
	expectedContentType: Exclude<chatContentType, 'call' | 'slideshow' | 'text'>
) =>
	AxiosUtil.requestHttp({
		url: lineConfig.LINE_MEDIA_GET_CONTENT_URL(messageId),
		headers: {
			Authorization: `Bearer ${lineConfig.LINE_CHANNEL_ACCESS_TOKEN}`
		},
		responseType: 'arraybuffer'
	}).then((response) => {
		const contentType = response.headers['content-type'] as string | undefined
		if (contentType == undefined) throw new Error('invalid expected content-type' + contentType)
		if (
			(expectedContentType === 'image' && contentType.split('/')[0] !== 'image') ||
			(expectedContentType === 'audio' && contentType.split('/')[0] !== 'audio') ||
			(expectedContentType === 'video' && contentType.split('/')[0] !== 'video')
		) {
			throw new Error(`expected content-type ${expectedContentType} does not match incoming ${contentType}`)
		}
		const fileExtension = mime.extension(contentType)
		return {
			fileExtension: fileExtension,
			data: response.data
		}
	})
// messageId - Message ID of video or audio
const getVideoAudioMessageContentStatus = async (messageId: string): Promise<boolean> => {
	const MAX_RETRIES = 3
	for (let i = 0; i < MAX_RETRIES; i++) {
		const response = await AxiosUtil.requestHttp<{
			status: 'processing' | 'succeeded' | 'failed'
		}>({
			url: lineConfig.LINE_MEDIA_PREPARATION_STATUS_URL(messageId),
			headers: {
				Authorization: `Bearer ${lineConfig.LINE_CHANNEL_ACCESS_TOKEN}`
			}
		})
		if (response.data.status === 'succeeded') return true
		// eslint-disable-next-line promise/avoid-new
		await new Promise((resolve) => setTimeout(() => resolve(true), i + 1000))
	}
	return false
}
export default {
	checkIfFriends,
	getProfile,
	getFollowerIds,
	getBulkProfiles,
	replyMessage,
	sendMessage,
	sendMulticastMessage,
	createRichMenu,
	setDefaultRichmenu,
	setRichMenuImage,
	linkRichMenuToUser,
	linkRichmenuToMultipleUsers,
	unlinkRichMenuFromUser,
	unlinkRichmenuFromMultipleUsers,
	deleteDefaultRichmenu,
	deleteRichMenu,

	createAudienceApi,
	listAudiencesApi,
	deleteAudienceApi,

	getMessageContent,
	getMessageContentCustom,
	getVideoAudioMessageContentStatus
}
