import {Router} from 'express'
import authMiddleware from '../services/Authenticator'
import UserController from '../controllers/UserController'

const routes = Router()

routes.post('/user/signup', UserController.signup)
routes.post('/user/logon', UserController.logon)

routes.use(authMiddleware.authRoutesMiddleware)
routes.get('/user/logoff', UserController.logoff)

export default routes