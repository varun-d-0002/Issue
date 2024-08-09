import path from 'path'
const rootPath = process.cwd()
export default {
	// print logs to console instead of file output
	CONSOLE_ONLY: process.env.CONSOLE_ONLY == 'true',
	// root app
	ROOT_PATH: path.join(rootPath),
	PATH_FILE_LOG: path.join(rootPath, 'logs'),
	PATH_FILE_UPLOAD: path.join(rootPath, 'public', 'uploads'),
	PATH_FILE_UPLOAD_MEMBER: path.join(rootPath, 'public', 'uploads', 'members'),
	PATH_FILE_UPLOAD_RICHMENU: path.join(rootPath, 'public', 'uploads', 'richmenus'),
	PATH_FILE_UPLOAD_SETTING: path.join(rootPath, 'public', 'uploads', 'settings'),
	PATH_LINE_UPLOAD: path.join(process.cwd(), 'storage', 'line'),

	LOG_PATH: path.join(rootPath, 'logs'),
	// PORT
	PORT: parseInt(process.env.PORT as string, 10),

	// Set the NODE_ENV to 'development' by default
	NODE_ENV: process.env.NODE_ENV || 'development',
	isDevelopment: process.env.NODE_ENV == 'development',
	ENV_TEST: process.env.ENV_TEST == 'true',

	SITE_URI: process.env.SITE_URI as string,
	NGROK_URI: process.env.NGROK_URI,
	// session
	SALT_ROUND: 10,
	SESS_NAME: process.env.SESS_NAME || '',
	SESS_SEC: process.env.SESS_SEC || '',
	ENC_SEC: process.env.ENC_SEC || ''
}
