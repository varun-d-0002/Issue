import { socketIO } from '../infra/loaders/socket.loader'

const emitAnnouncement = (arg: { announcementId: number | string }) => socketIO.emit('announcement', arg)

const emitAttendance = (arg: { attendanceId: number }) => socketIO.emit('attendance', arg)

const emitAudience = (arg: { audienceGroupId: number | string }) => socketIO.emit('audience', arg)

const emitCategory = (arg: { categoryId?: number }) => socketIO.emit('category', arg)

const emitChat = (arg: { memberId: number }) => socketIO.emit('chat', arg)

const emitFavicon = (arg: { favicon: string }) => socketIO.emit('favicon', arg)

const emitLogo = (arg: { logo: string }) => socketIO.emit('logo', { logo: arg.logo })

const emitStorePic = (arg: { storePic: string }) => socketIO.emit('storePic', { logo: arg.storePic })

const emitMember = (arg: { memberId: number | string | null }) => socketIO.emit('member', arg)

const emitOccasion = (arg: { occasionId?: number; categoryId?: number }) => socketIO.emit('occasion', arg)

const emitOccurrence = (arg: {
	categoryId: number | null
	occasionId: number | null
	occurrenceId?: number
	occurrenceIds?: number[]
}) => socketIO.emit('occurrence', arg)

const emitRegistration = (arg: registrationEmitType) => socketIO.emit('registration', arg)

const emitSystemSetting = (arg: { keys: string[] }) => socketIO.emit('systemSetting', arg)

const emitTemplate = (arg: { name: string }) => socketIO.emit('template', arg)

const emitTimeline = ({ timelineId }: { timelineId: number }) =>
	socketIO.emit('announcement', { announcementId: timelineId })

export default {
	emitAnnouncement,
	emitAttendance,
	emitAudience,
	emitCategory,
	emitChat,
	emitFavicon,
	emitLogo,
	emitStorePic,
	emitMember,
	emitOccasion,
	emitOccurrence,
	emitRegistration,
	emitSystemSetting,
	emitTemplate,
	emitTimeline
}
