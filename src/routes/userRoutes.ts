import {Router} from 'express'

import authMiddleware from '../middlewares/authMiddleware'
import UserController from '../controllers/UserController'

const routes = Router()

routes.post('/user/signup', UserController.signup)
routes.post('/user/logon', UserController.logon)
routes.get('/user/logoff', authMiddleware, UserController.logoff)

export default routes