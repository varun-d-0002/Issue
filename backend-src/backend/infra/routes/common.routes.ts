import { Router } from 'express'
import { SystemSettingController } from '../controllers'

const router = Router()

router.get('/favicon', SystemSettingController.getFavicon)
router.get('/logo', SystemSettingController.getLogo)
router.get('/store/pic', SystemSettingController.getStorePic)
router.get('/settings', SystemSettingController.getPublicSettings)

export default router
