import { Router } from 'express'
import { MulterMiddleware } from '../middlewares/'
import {
	AudienceController,
	ChatController,
	MemberController,
	ManagerController,
	RichmenuController,
	SystemSettingController,
	SpectatorController,
} from '../controllers'

const router = Router()

router.get('/members/chats/:memberId', ChatController.getChat)
router.post('/members/chats/:memberId', ChatController.replyChat)
// router.post('/members/csv', MemberController.generateMemberCSV)
router.get('/members', MemberController.browseMembers)
// router.get('/managers', ManagerController.checkAuthenticatedUser)
// router.post('/managers', ManagerController.checkAuthenticatedUser)
router.get('/members/list', MemberController.listMembers)
router.put('/members/:memberId', MemberController.updateMember)
router.get('/members/:memberId', MemberController.getMember)
router.post('/members/barcode', MemberController.getMemberByBarCode)
router.delete('/members/:memberId', MemberController.deleteMember)
// //SPECTATORS
router.get('/spectators/candidates', SpectatorController.listPossibleSpectators)
router.get('/spectators', SpectatorController.listSpectators)
router.post('/spectators', SpectatorController.bulkEditSpectators)
router.delete('/spectators/:spectatorId', SpectatorController.deleteSpectator)
// //RICHMENUS
router.get('/richmenus', RichmenuController.listRichmenu)
router.put('/richmenus/props', RichmenuController.setRichmenuProps)
router.put('/richmenus', MulterMiddleware.richmenuUpload.single('picUrl'), RichmenuController.setRichmenu)
router.delete('/richmenus', RichmenuController.deleteRichmenu)
// //SYSTEM SETTINGS
router.get('/settings', SystemSettingController.getSystemSettings)
router.get('/settings/:key', SystemSettingController.getSystemSetting)
router.put('/settings', SystemSettingController.setBulkSystemSettings)
router.put('/settings/:key', SystemSettingController.setSystemSettings)
router.delete('/settings/:key', SystemSettingController.deleteSettings)
router.put(
	'/logo',
	MulterMiddleware.uploadImage.single('picUrl'),
	MulterMiddleware.multerFileEncodingFixer('picUrl', false),
	SystemSettingController.setLogo,
)
router.put(
	'/favicon',
	MulterMiddleware.uploadIco.single('picUrl'),
	MulterMiddleware.multerFileEncodingFixer('picUrl', false),
	SystemSettingController.setFavicon,
)
router.put(
	'/store/pic',
	MulterMiddleware.uploadImage.single('picUrl'),
	MulterMiddleware.multerFileEncodingFixer('picUrl', false),
	SystemSettingController.setStorePic,
)

router.get('/audiences', AudienceController.listAudiences)
router.post('/audiences/find', AudienceController.searchAudience)
router.post('/audiences', AudienceController.createAudience)
router.delete('/audiences/:audienceGroupId', AudienceController.deleteAudience)

export default router
