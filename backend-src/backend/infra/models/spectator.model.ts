import {
	Model,
	DataTypes,
	Association,
	Transaction,
	ForeignKey,
	CreationOptional,
	NonAttribute,
	InferAttributes,
	InferCreationAttributes
} from 'sequelize'
import { sequelize } from './database'
import type MemberModel from './member.model'
class SpectatorModel extends Model<
	InferAttributes<SpectatorModel, { omit: 'Member' }>,
	InferCreationAttributes<SpectatorModel, { omit: 'Member' }>
> {
	//ATTRIBUTES
	declare spectatorId: CreationOptional<number>
	declare memberId: ForeignKey<MemberModel['memberId']>
	declare isSpectatingMember: CreationOptional<boolean>
	//TIMESTAMPS
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
	//ASSOCIATIONS
	declare Member: NonAttribute<MemberModel>
	declare static associations: {
		Member: Association<MemberModel, SpectatorModel>
	}
	static async getAdmins(transaction?: Transaction) {
		return await SpectatorModel.findAll({
			include: {
				association: SpectatorModel.associations.Member,
				attributes: ['displayName', 'firstName', 'lastName', 'lineId']
			},
			transaction
		})
	}
}

SpectatorModel.init(
	{
		spectatorId: {
			type: DataTypes.INTEGER({ unsigned: true }),
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		memberId: { type: DataTypes.INTEGER({ unsigned: true }), allowNull: false, unique: 'memberId' },
		isSpectatingMember: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE
	},
	{
		sequelize: sequelize,
		timestamps: true,
		paranoid: false,
		charset: 'utf8mb4',
		collate: 'utf8mb4_general_ci',
		tableName: 'spectators',
		modelName: 'Spectator',
		name: {
			singular: 'Spectator',
			plural: 'spectators'
		}
	}
)

export default SpectatorModel
