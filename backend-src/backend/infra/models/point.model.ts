import {
	Model,
	DataTypes,
	Association,
	NOW,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	NonAttribute,
	ForeignKey
} from 'sequelize'
import { sequelize } from './database'
import type MemberModel from './member.model'
import type MemberVisitModel from './memberVisit.model'
class PointModel extends Model<
	InferAttributes<PointModel, { omit: 'Member' | 'Visit' }>,
	InferCreationAttributes<PointModel, { omit: 'Member' | 'Visit' }>
> {
	//ATTRIBUTES
	declare pointId: CreationOptional<number>
	declare memberId: ForeignKey<MemberModel['memberId']>
	declare visitId: ForeignKey<MemberVisitModel['memberVisitId'] | null>
	declare point: number
	declare processedAt: CreationOptional<Date>
	//TIMESTAMPS
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
	//ASSOCIATIONS
	declare Member?: NonAttribute<MemberModel>
	declare Visit?: NonAttribute<MemberVisitModel | null>
	declare static associations: {
		Member: Association<MemberModel, PointModel>
		Visit: Association<MemberVisitModel, PointModel>
	}
}

PointModel.init(
	{
		pointId: { type: DataTypes.INTEGER({ unsigned: true }), primaryKey: true, autoIncrement: true },
		memberId: { type: DataTypes.INTEGER({ unsigned: true }), allowNull: false },
		visitId: { type: DataTypes.INTEGER({ unsigned: true }), allowNull: true },
		point: { type: DataTypes.INTEGER, allowNull: false },
		processedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: NOW() },
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE
	},
	{
		sequelize: sequelize,
		timestamps: false,
		charset: 'utf8mb4',
		collate: 'utf8mb4_general_ci',
		tableName: 'points',
		modelName: 'Point',
		name: {
			singular: 'Point',
			plural: 'points'
		}
	}
)

export default PointModel
