import { Router } from 'express'
import { AuthMiddleware } from '../middlewares'
import authRouter from './auth.routes'
import masterRouter from './master.routes'
import commonRouter from './common.routes'
import webhookRouter from './webhook.routes'
import liffRouter from './liff.routes'

const router = Router()
router.use(commonRouter)
router.use('/auth', authRouter)
router.use('/m', AuthMiddleware.checkSession, masterRouter)

router.use('/hooks', webhookRouter)
router.use('/liff', AuthMiddleware.checkLineProfile, liffRouter)

export default router
