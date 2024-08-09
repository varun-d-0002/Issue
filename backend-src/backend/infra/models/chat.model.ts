import {
	Model,
	Association,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	ForeignKey,
	NonAttribute
} from 'sequelize'
import { sequelize } from './database'
import type MemberModel from './member.model'
class ChatModel extends Model<
	InferAttributes<ChatModel, { omit: 'Member' }>,
	InferCreationAttributes<ChatModel, { omit: 'Member' }>
> {
	//ATTRIBUTES
	declare chatId: CreationOptional<number>
	declare memberId: ForeignKey<MemberModel['memberId']>
	declare contents: string
	declare contentType: CreationOptional<chatContentType>
	declare source: chatSource
	//TIMESTAMPS
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
	//ASSOCIATIONS
	declare Member?: NonAttribute<MemberModel>
	declare static associations: {
		Member: Association<MemberModel, ChatModel>
	}
}

ChatModel.init(
	{
		chatId: { type: DataTypes.INTEGER({ unsigned: true }), primaryKey: true, autoIncrement: true },
		contents: { type: DataTypes.STRING(1000), allowNull: false },
		contentType: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'text' },
		source: { type: DataTypes.STRING, allowNull: false },
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE
	},
	{
		sequelize: sequelize,
		timestamps: true,
		paranoid: false,
		charset: 'utf8mb4',
		collate: 'utf8mb4_general_ci',
		tableName: 'chats',
		modelName: 'Chat',
		name: {
			singular: 'Chat',
			plural: 'chats'
		}
	}
)

export default ChatModel
