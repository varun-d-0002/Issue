import session from 'express-session'
import ConnectSessionSequelize from 'connect-session-sequelize' //(session.Store)
const SequelizeStore = ConnectSessionSequelize(session.Store)
import { systemConfig } from '../../config'
import { db, getSequelize } from '../models'

declare module 'express-session' {
	export interface SessionData {
		user: managerSessionDataType
	}
}

export default session({
	secret: systemConfig.SESS_SEC,
	name: systemConfig.SESS_NAME,
	store: new SequelizeStore({
		db: getSequelize(),
		table: db.Session.name,
		tableName: db.Session.tableName,
		checkExpirationInterval: 60 * 60 * 1000
	}),
	resave: false,
	saveUninitialized: false,
	cookie: {
		sameSite: 'strict',
		maxAge: 86400000 * 7
	}
})
