import { Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize'
import { sequelize } from './database'
class SessionModel extends Model<InferAttributes<SessionModel>, InferCreationAttributes<SessionModel>> {
	declare sid: string
	declare expires: Date
	declare data: string
}

SessionModel.init(
	{
		sid: { type: DataTypes.STRING(36), primaryKey: true },
		expires: { type: DataTypes.DATE, allowNull: false },
		data: { type: DataTypes.TEXT, allowNull: false }
	},
	{
		sequelize: sequelize,
		timestamps: true,
		paranoid: false,
		charset: 'utf8mb4',
		collate: 'utf8mb4_general_ci',
		tableName: 'sessions',
		modelName: 'Session',
		name: {
			singular: 'Session',
			plural: 'sessions'
		}
	}
)

export default SessionModel
