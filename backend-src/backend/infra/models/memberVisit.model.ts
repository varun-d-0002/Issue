import {
	Model,
	DataTypes,
	Association,
	CreationOptional,
	InferAttributes,
	InferCreationAttributes,
	NonAttribute,
	ForeignKey
} from 'sequelize'
import { sequelize } from './database'
import type MemberModel from './member.model'
import type PointModel from './point.model'
class MemberVisitModel extends Model<
	InferAttributes<MemberVisitModel, { omit: 'Member' | 'Point' }>,
	InferCreationAttributes<MemberVisitModel, { omit: 'Member' | 'Point' }>
> {
	//ATTRIBUTES
	declare memberVisitId: CreationOptional<number>
	declare memberId: ForeignKey<MemberModel['memberId']>
	declare visitDate: Date
	//ASSOCIATIONS
	declare Member?: NonAttribute<MemberModel>
	declare Point?: NonAttribute<PointModel>
	declare static associations: {
		Member: Association<MemberVisitModel, MemberModel>
		Point: Association<MemberVisitModel, PointModel>
	}
}

MemberVisitModel.init(
	{
		memberVisitId: { type: DataTypes.INTEGER({ unsigned: true }), primaryKey: true, autoIncrement: true },
		memberId: { type: DataTypes.INTEGER({ unsigned: true }), allowNull: false },
		visitDate: { type: DataTypes.DATE, allowNull: false }
	},
	{
		sequelize: sequelize,
		paranoid: true,
		charset: 'utf8mb4',
		collate: 'utf8mb4_general_ci',
		tableName: 'memberVisits',
		modelName: 'MemberVisit',
		name: {
			singular: 'MemberVisit',
			plural: 'memberVisits'
		}
	}
)
export default MemberVisitModel
