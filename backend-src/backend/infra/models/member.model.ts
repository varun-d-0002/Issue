import {
	Model,
	DataTypes,
	Association,
	Transaction,
	CreationOptional,
	InferAttributes,
	InferCreationAttributes,
	NonAttribute,
	HasManyCreateAssociationMixin
} from 'sequelize'
import type ChatModel from './chat.model'
import type MemberVisitModel from './memberVisit.model'
import type PointModel from './point.model'
import type MemberPreferenceModel from './memberPreference.model'
import { sequelize } from './database'

interface lineProfile {
	userId: string
	displayName: string
	pictureUrl: string | null
	statusMessage: string | null
}

class MemberModel extends Model<
	InferAttributes<MemberModel, { omit: 'chats' | 'points' | 'visits' }>,
	InferCreationAttributes<MemberModel, { omit: 'chats' | 'points' | 'visits' }>
> {
	//ATTRIBUTES
	declare memberId: CreationOptional<number>
	declare memberCode: string | null
	declare lineId: lineProfile['userId']
	declare displayName: lineProfile['displayName']
	declare isFriends: CreationOptional<boolean>
	declare picUrl: lineProfile['pictureUrl']
	declare firstName: string | null
	declare lastName: string | null
	declare firstNameKana: string | null
	declare lastNameKana: string | null
	declare dateOfBirth: Date | null
	declare gender: 'male' | 'female' | null
	declare kakeruPoint: number | null
	declare telephone: string | null
	declare postalCode: string | null
	declare prefecture: string | null
	declare city: string | null
	declare address: string | null
	declare building: string | null
	declare activeUntil: Date | null
	declare memberSince: Date | null
	declare curRM: string | null
	declare remarks: string | null
	declare unreadCount: CreationOptional<number>
	//TIMESTAMPS
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
	//ASSOCIATIONS
	declare chats?: NonAttribute<ChatModel[]>
	declare visits?: NonAttribute<MemberVisitModel[]>
	declare points?: NonAttribute<PointModel[]>
	declare preferences?: NonAttribute<MemberPreferenceModel[]>
	declare preferenceTypes?: NonAttribute<MemberPreferenceModel[]>
	declare preferenceAreas?: NonAttribute<MemberPreferenceModel[]>
	declare static associations: {
		chats: Association<MemberModel, ChatModel>
		visits: Association<MemberModel, MemberVisitModel>
		points: Association<MemberModel, PointModel>
		preferences: Association<MemberModel, MemberPreferenceModel>
		preferenceTypes: Association<MemberModel, MemberPreferenceModel>
		preferenceAreas: Association<MemberModel, MemberPreferenceModel>
	}
	declare createChat: HasManyCreateAssociationMixin<ChatModel>
	declare createVisit: HasManyCreateAssociationMixin<MemberVisitModel>
	declare createPoint: HasManyCreateAssociationMixin<PointModel>

	public isRichmenuLinkable = () => {
		if (undefined === this.isFriends) throw new Error('isRichmenuLinkable isFriend undefined |null')
		if (undefined === this.lineId) throw new Error('isRichmenuLinkable lineId undefined |null')
		return this.isFriends === true && this.lineId !== null
	}
	public addOrDeductPoint(newRelativePoint: number, pointIsAdd: boolean) {
		const addOrReduceMultiplier = pointIsAdd ? 1 : -1
		const previousPoint = this.kakeruPoint ?? 0
		return previousPoint + newRelativePoint * addOrReduceMultiplier
	}

	static async findMember(memberLine: lineProfile, transaction?: Transaction) {
		const member = await MemberModel.findOne({
			where: { lineId: memberLine.userId },
			transaction
		})
		if (member == null) {
			return await MemberModel.create(
				{
					lineId: memberLine.userId,
					displayName: memberLine.displayName,
					picUrl: memberLine.pictureUrl,
					curRM: 'defaultRM'
				},
				{ transaction }
			)
		}
		member.set({
			displayName: memberLine.displayName,
			picUrl: memberLine.pictureUrl
		})
		if (member.changed()) await member.save({ transaction })
		return member
	}
}

MemberModel.init(
	{
		memberId: { type: DataTypes.INTEGER({ unsigned: true }), primaryKey: true, autoIncrement: true },
		memberCode: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
		lineId: { type: DataTypes.STRING, allowNull: false, unique: 'lineId' },
		displayName: { type: DataTypes.STRING, allowNull: false },
		isFriends: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
		picUrl: { type: DataTypes.STRING, allowNull: true },
		firstName: { type: DataTypes.STRING(32), allowNull: true, defaultValue: null },
		lastName: { type: DataTypes.STRING(32), allowNull: true, defaultValue: null },
		firstNameKana: { type: DataTypes.STRING(32), allowNull: true, defaultValue: null },
		lastNameKana: { type: DataTypes.STRING(32), allowNull: true, defaultValue: null },
		dateOfBirth: { type: DataTypes.DATEONLY, allowNull: true, defaultValue: null },
		gender: { type: DataTypes.STRING(10), allowNull: true, defaultValue: null },
		kakeruPoint: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
		activeUntil: { type: DataTypes.DATEONLY, allowNull: true, defaultValue: null },
		telephone: { type: DataTypes.STRING(20), allowNull: true, defaultValue: null },
		postalCode: { type: DataTypes.STRING(10), allowNull: true, defaultValue: null },
		prefecture: { type: DataTypes.STRING(10), allowNull: true, defaultValue: null },
		city: { type: DataTypes.STRING(20), allowNull: true, defaultValue: null },
		address: { type: DataTypes.STRING(60), allowNull: true, defaultValue: null },
		building: { type: DataTypes.STRING(60), allowNull: true, defaultValue: null },
		memberSince: { type: DataTypes.DATEONLY, allowNull: true, defaultValue: null },
		curRM: { type: DataTypes.STRING(64), allowNull: true, defaultValue: null },
		remarks: { type: DataTypes.STRING, allowNull: true },
		unreadCount: { type: DataTypes.INTEGER({ unsigned: true }), allowNull: false, defaultValue: 0 },
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE
	},
	{
		sequelize: sequelize,
		paranoid: false,
		charset: 'utf8mb4',
		collate: 'utf8mb4_general_ci',
		tableName: 'members',
		modelName: 'Member',
		name: {
			singular: 'Member',
			plural: 'members'
		}
	}
)

export default MemberModel
