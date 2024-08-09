import { Router } from 'express'
import { AuthenticationController, ManagerController } from '../controllers'
import { AuthMiddleware } from '../middlewares'
import { RESPONSE_SUCCESS } from '../../config'

const router = Router()

router.post('/login', AuthenticationController.login)
router.get('/logout', AuthenticationController.logout)
router.get('/sess', AuthMiddleware.checkSession, (req, res) => {
	res.sendStatus(RESPONSE_SUCCESS)
})

router.get('/auth', AuthMiddleware.checkSession, ManagerController.checkAuthenticatedUser)

export default router
