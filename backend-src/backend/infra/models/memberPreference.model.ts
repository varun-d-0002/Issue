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
class MemberPreferenceModel extends Model<
	InferAttributes<MemberPreferenceModel, { omit: 'Member' }>,
	InferCreationAttributes<MemberPreferenceModel, { omit: 'Member' }>
> {
	//ATTRIBUTES
	declare memberPreferenceId: CreationOptional<number>
	declare memberId: ForeignKey<MemberModel['memberId']>
	declare preferenceType: preferenceType
	declare choice: string
	//ASSOCIATIONS
	declare Member?: NonAttribute<MemberModel>
	declare static associations: {
		Member: Association<MemberPreferenceModel, MemberModel>
	}
	static SCOPES = Object.freeze({
		area: 'serviceArea',
		type: 'serviceType'
	})
}

MemberPreferenceModel.init(
	{
		memberPreferenceId: { type: DataTypes.INTEGER({ unsigned: true }), primaryKey: true, autoIncrement: true },
		memberId: { type: DataTypes.INTEGER({ unsigned: true }), allowNull: false },
		preferenceType: { type: DataTypes.STRING(20), allowNull: false },
		choice: { type: DataTypes.STRING(50), allowNull: false }
	},
	{
		sequelize: sequelize,
		paranoid: true,
		timestamps: false,
		charset: 'utf8mb4',
		collate: 'utf8mb4_general_ci',
		tableName: 'memberPreferences',
		modelName: 'MemberPreference',
		name: {
			singular: 'MemberPreference',
			plural: 'memberPreferences'
		}
	}
)
MemberPreferenceModel.addScope(MemberPreferenceModel.SCOPES.area, {
	where: {
		preferenceType: MemberPreferenceModel.SCOPES.area
	}
})
MemberPreferenceModel.addScope(MemberPreferenceModel.SCOPES.type, {
	where: {
		preferenceType: MemberPreferenceModel.SCOPES.type
	}
})

export default MemberPreferenceModel
