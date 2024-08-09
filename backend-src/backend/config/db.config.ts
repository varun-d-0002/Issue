export default {
	HOST: process.env.DB_HOSTNAME as string,
	USER: process.env.DB_USERNAME as string,
	PASSWORD: process.env.DB_PASSWORD as string,
	DB: process.env.DB_NAME as string,
	DIALECT: process.env.DB_DIALECT as string,
	PORT: process.env.DB_PORT as undefined,
	POOL: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	},
	LOGGING: undefined
}
