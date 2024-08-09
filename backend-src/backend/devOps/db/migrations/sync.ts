import { Sequelize } from 'sequelize'

export default async function (sequelize: Sequelize) {
	await sequelize.sync({ alter: true })
}
