import { Sequelize } from 'sequelize'
import { dbConfig } from '../../config'

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
	host: dbConfig.HOST,
	dialect: dbConfig.DIALECT as 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | undefined,
	port: dbConfig.PORT,
	pool: {
		max: dbConfig.POOL.max,
		min: dbConfig.POOL.min,
		acquire: dbConfig.POOL.acquire,
		idle: dbConfig.POOL.idle
	},
	timezone: '+09:00',
	logging: dbConfig.LOGGING
})
export { sequelize }
