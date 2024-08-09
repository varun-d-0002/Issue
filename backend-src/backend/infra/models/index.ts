import { sequelize } from './database'
import AudienceModel from './audience.model'
import ChatModel from './chat.model'
import ManagerModel from './manager.model'
import MemberModel from './member.model'
import MemberPreferenceModel from './memberPreference.model'
import MemberVisitModel from './memberVisit.model'
import PointModel from './point.model'
import RichmenuModel from './richmenu.model'
import SessionModel from './session.model'
import SpectatorModel from './spectator.model'
import SystemSettingModel from './systemSetting.model'

ChatModel.belongsTo(MemberModel, { foreignKey: 'memberId', onDelete: 'CASCADE' })
MemberModel.hasMany(ChatModel, { foreignKey: 'memberId', onDelete: 'CASCADE' })
MemberVisitModel.belongsTo(MemberModel, { foreignKey: 'memberId', onDelete: 'CASCADE' })
MemberModel.hasMany(MemberVisitModel, { as: 'visits', foreignKey: 'memberId' })
MemberPreferenceModel.belongsTo(MemberModel, { foreignKey: 'memberId', onDelete: 'CASCADE' })
MemberModel.hasMany(MemberPreferenceModel, { as: 'preferences', foreignKey: 'memberId' })
PointModel.belongsTo(MemberModel, { foreignKey: 'memberId', onDelete: 'CASCADE' })
MemberModel.hasMany(PointModel, { as: 'points', foreignKey: 'memberId' })
PointModel.belongsTo(MemberVisitModel, { as: 'Visit', foreignKey: 'visitId', onDelete: 'CASCADE' })
MemberVisitModel.hasOne(PointModel, { as: 'Point', foreignKey: 'visitId' })
MemberModel.hasOne(SpectatorModel, { foreignKey: 'memberId' })
SpectatorModel.belongsTo(MemberModel, { foreignKey: 'memberId' })

MemberModel.hasMany(MemberPreferenceModel.scope(MemberPreferenceModel.SCOPES.area), {
	as: 'preferenceAreas',
	foreignKey: 'memberId',
	sourceKey: 'memberId'
})
MemberModel.hasMany(MemberPreferenceModel.scope(MemberPreferenceModel.SCOPES.type), {
	as: 'preferenceTypes',
	foreignKey: 'memberId',
	sourceKey: 'memberId'
})

const db = Object.freeze({
	Audience: AudienceModel,
	Chat: ChatModel,
	Member: MemberModel,
	MemberPreference: MemberPreferenceModel,
	MemberVisit: MemberVisitModel,
	Manager: ManagerModel,
	Point: PointModel,
	Richmenu: RichmenuModel,
	Session: SessionModel,
	Spectator: SpectatorModel,
	SystemSetting: SystemSettingModel
})

const getSequelize = () => sequelize
const getTransaction = () => sequelize.transaction()

export { db, getSequelize, getTransaction }
