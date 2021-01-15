import {Router} from 'express'
import UserController from '../controllers/UserController'

const routes = Router()

routes.post('/user/signup', UserController.signup)
routes.post('/user/logon', UserController.logon)
routes.post('/user/logoff', UserController.logoff)

export default routes