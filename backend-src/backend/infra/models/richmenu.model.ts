import { RichMenu as LineRichMenu } from '@line/bot-sdk'
import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, Transaction } from 'sequelize'
import { sequelize } from './database'
import { RICHMENU_TYPES } from '../../config'

class RichmenuModel extends Model<InferAttributes<RichmenuModel>, InferCreationAttributes<RichmenuModel>> {
	declare richmenuId: string
	declare picUrl: string
	declare type: richmenuType
	declare pattern: LineRichMenu | string
	declare isDisplayed: boolean
	declare link1: string | null
	declare link2: string | null
	declare link3: string | null
	declare link4: string | null
	declare link5: string | null
	declare link6: string | null
	//TIMESTAMPS
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>

	static listRichmenu = async (transaction?: Transaction) => {
		const result: Record<richmenuType, any> = {
			defaultRM: null,
			memberRM: null
		}
		const richmenus = await this.findAll({ transaction })
		RICHMENU_TYPES.map((rt) => {
			const richmenu = richmenus.find((rm) => rm.type == rt)
			result[rt as richmenuType] = richmenu ?? null
		})
		return result
	}
}

RichmenuModel.init(
	{
		richmenuId: { type: DataTypes.STRING(64), primaryKey: true },
		picUrl: { type: DataTypes.STRING(150), allowNull: false },
		type: { type: DataTypes.STRING(20), allowNull: false },
		pattern: { type: DataTypes.STRING(5000), allowNull: false },
		isDisplayed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
		link1: { type: DataTypes.STRING(1000), allowNull: true, defaultValue: null },
		link2: { type: DataTypes.STRING(1000), allowNull: true, defaultValue: null },
		link3: { type: DataTypes.STRING(1000), allowNull: true, defaultValue: null },
		link4: { type: DataTypes.STRING(1000), allowNull: true, defaultValue: null },
		link5: { type: DataTypes.STRING(1000), allowNull: true, defaultValue: null },
		link6: { type: DataTypes.STRING(1000), allowNull: true, defaultValue: null },
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE
	},
	{
		sequelize: sequelize,
		timestamps: true,
		charset: 'utf8mb4',
		collate: 'utf8mb4_general_ci',
		tableName: 'richmenus',
		modelName: 'Richmenu',
		name: {
			singular: 'Richmenu',
			plural: 'richmenus'
		}
	}
)

export default RichmenuModel
