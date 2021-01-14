import {Router} from 'express'
import UserController from '../controllers/UserController'

const routes = Router()

routes.post('/user/signup', UserController.signup)
routes.post('/user/signup', UserController.logon)
routes.post('/user/signup', UserController.logoff)

export default routes