export default {
	SYNC_FOLLOWERS_DEFAULT_FETCH_SIZE: 50,
	SYNC_FOLLOWERS_MIN_FETCH_SIZE: 50,
	SYNC_FOLLOWERS_MAX_FETCH_SIZE: 100,
	SYNC_FOLLOWERS_MAX_ITERATION_COUNT: 500,
	LINE_LOGIN_CHANNEL_ID: process.env.LINE_LOGIN_CHANNEL_ID as string,
	LINE_CHANNEL_ACCESS_TOKEN: process.env.LINE_CHANNEL_ACCESS_TOKEN as string,
	LINE_CHANNEL_SECRET: process.env.LINE_CHANNEL_SECRET as string,
	LINE_MEDIA_PREPARATION_STATUS_URL: (messageId: string) =>
		`https://api-data.line.me/v2/bot/message/${messageId}/content/transcoding`,
	LINE_MEDIA_GET_CONTENT_URL: (messageId: string) => `https://api-data.line.me/v2/bot/message/${messageId}/content`
}
