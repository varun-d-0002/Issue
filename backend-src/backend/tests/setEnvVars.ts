// eslint-disable-next-line @typescript-eslint/no-var-requires
// const envVars = require(process.cwd() + '/.env.ci')
import dotenv from 'dotenv'
const envVars = dotenv.config({ path: process.cwd() + '/.env.ci' }).parsed as any
if (
	!envVars.DB_HOSTNAME ||
	!envVars.DB_HOSTNAME ||
	!envVars.DB_USERNAME ||
	!envVars.DB_PASSWORD === undefined ||
	!envVars.DB_NAME ||
	!envVars.DB_DIALECT ||
	!envVars.DB_PORT
) {
	throw new Error('.env.ci DB not specified')
}
if (
	!envVars.INIT_MANAGER_EMAIL === undefined ||
	!envVars.INIT_MANAGER_USERNAME === undefined ||
	!envVars.INIT_MANAGER_PASSWORD === undefined
) {
	throw new Error('.env.ci manager info not specified')
}
if (
	!envVars.NODE_ENV === undefined ||
	!envVars.SITE_URI === undefined ||
	!envVars.ENC_SEC === undefined ||
	!envVars.PORT === undefined ||
	!envVars.SESS_SEC === undefined ||
	!envVars.SESS_NAME === undefined
) {
	throw new Error('.env.ci system setting not specified')
}
process.env.DB_HOSTNAME = envVars.DB_HOSTNAME
process.env.DB_USERNAME = envVars.DB_USERNAME
process.env.DB_PASSWORD = envVars.DB_PASSWORD
process.env.DB_NAME = envVars.DB_NAME
process.env.DB_DIALECT = envVars.DB_DIALECT
process.env.DB_PORT = envVars.DB_PORT
process.env.PORT = envVars.PORT
process.env.SITE_URI = envVars.SITE_URI
process.env.ENC_SEC = envVars.ENC_SEC
process.env.SESS_SEC = envVars.SESS_SEC
process.env.SESS_NAME = envVars.SESS_NAME
process.env.LINE_CHANNEL_ACCESS_TOKEN = envVars.LINE_CHANNEL_ACCESS_TOKEN
process.env.LINE_CHANNEL_SECRET = envVars.LINE_CHANNEL_SECRET
process.env.LINE_LOGIN_CHANNEL_ID = envVars.LINE_LOGIN_CHANNEL_ID
process.env.LINE_LIFF_URI = envVars.LINE_LIFF_URI
process.env.LINE_MSG_NOT_IMPLEMENTED = envVars.LINE_MSG_NOT_IMPLEMENTED
process.env.NODE_ENV = envVars.NODE_ENV
process.env.ENV_TEST = envVars.ENV_TEST
process.env.CONSOLE_ONLY = envVars.CONSOLE_ONLY
process.env.NGROK_URI = envVars.NGROK_URI
process.env.INIT_MANAGER_EMAIL = envVars.INIT_MANAGER_EMAIL
process.env.INIT_MANAGER_USERNAME = envVars.INIT_MANAGER_USERNAME
process.env.INIT_MANAGER_PASSWORD = envVars.INIT_MANAGER_PASSWORD
