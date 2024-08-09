import { Router } from 'express'
import { MemberController } from '../controllers'

const router = Router()

router.put('/personal', MemberController.updatePersonalInfo)
router.get('/personal', MemberController.getPersonalInfo)

export default router
