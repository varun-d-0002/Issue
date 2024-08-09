import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize'
import { sequelize } from './database'
class AudienceModel extends Model<InferAttributes<AudienceModel>, InferCreationAttributes<AudienceModel>> {
	//ATTRIBUTES
	declare audienceGroupId: CreationOptional<string>
	declare description: string
	declare audienceCount: number
	declare searchCondition: string | object | null
	declare remarks: string | object | null
	//TIMESTAMPS
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
}

AudienceModel.init(
	{
		audienceGroupId: { type: DataTypes.STRING({ length: 15 }), primaryKey: true },
		audienceCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
		description: { type: DataTypes.STRING(120), allowNull: true },
		searchCondition: { type: DataTypes.JSON, allowNull: true },
		remarks: { type: DataTypes.JSON, allowNull: true },
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE
	},
	{
		sequelize: sequelize,
		timestamps: true,
		paranoid: false,
		charset: 'utf8mb4',
		collate: 'utf8mb4_general_ci',
		tableName: 'audiences',
		modelName: 'Audience',
		name: {
			singular: 'Audience',
			plural: 'audiences'
		}
	}
)

export default AudienceModel
