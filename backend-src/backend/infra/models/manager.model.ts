import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, Transaction } from 'sequelize'
import { sequelize } from './database'
class ManagerModel extends Model<InferAttributes<ManagerModel>, InferCreationAttributes<ManagerModel>> {
	//ATTRIBUTES
	declare managerId: CreationOptional<number>
	declare username: string
	declare pwhash: string
	declare recoveryMail: string
	declare authLevel: IAuth
	declare isActivated: CreationOptional<boolean>
	//TIMESTAMPS
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>

	static AUTH_MANAGER = 'manager' as IAuth
	static AUTH_MASTER = 'master' as IAuth

	static getManager = (managerId: number, transaction?: Transaction) => this.findByPk(managerId, { transaction })

	static findManagerByUsername = (username: string, transaction?: Transaction) =>
		this.findOne({ where: { username }, transaction })
}

ManagerModel.init(
	{
		managerId: {
			type: DataTypes.INTEGER({ unsigned: true }),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		username: { type: DataTypes.STRING(100), allowNull: false, unique: 'username' },
		pwhash: { type: DataTypes.STRING, allowNull: false },
		recoveryMail: { type: DataTypes.STRING(100), allowNull: true },
		authLevel: { type: DataTypes.STRING(10), defaultValue: ManagerModel.AUTH_MANAGER, allowNull: false },
		isActivated: { type: DataTypes.BOOLEAN, defaultValue: false },
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE
	},
	{
		timestamps: true,
		paranoid: false,
		sequelize: sequelize,
		charset: 'utf8mb4',
		collate: 'utf8mb4_general_ci',
		tableName: 'managers',
		modelName: 'Manager',
		name: {
			singular: 'Manager',
			plural: 'managers'
		}
	}
)
export default ManagerModel
