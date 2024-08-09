import { lineConfig } from '../../config'
import { AxiosUtil } from '../../utilities'

const validateAuthenticationParams = ({ username, password }: authenticationParam) => {
	if (!(username && password)) return null
	return { username, password }
}
const verifyAccessToken = async (token: string) => {
	try {
		const oauth2 = await AxiosUtil.requestHttp({
			url: `https://api.line.me/oauth2/v2.1/verify?access_token=${token}`,
			method: 'GET',
			headers: {
				Accept: 'application/json'
			}
		}).then((r) => r.data)
		if (oauth2.error) throw new Error(`oauth axios err ${oauth2.error_description}`)
		if (oauth2.client_id != lineConfig.LINE_LOGIN_CHANNEL_ID)
			throw new Error(`client_id mismatch ${oauth2.client_id} != ${lineConfig.LINE_LOGIN_CHANNEL_ID}`)
		if (oauth2.expires_in <= 0) throw new Error(`expired ${oauth2.expires_in} < 0`)
		return true
	} catch (e) {
		return false
	}
}

const getProfileByToken = async (token: string): Promise<lineProfile | null> => {
	try {
		return await AxiosUtil.requestHttp({
			url: 'https://api.line.me/v2/profile',
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json'
			}
		}).then((r) => r.data as lineProfile)
	} catch (e) {
		return null
	}
}
export default { validateAuthenticationParams, verifyAccessToken, getProfileByToken }
