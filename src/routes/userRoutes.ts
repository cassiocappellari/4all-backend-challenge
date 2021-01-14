import {Router} from 'express'
import UserController from '../controllers/UserController'

const routes = Router()

routes.post('/user/signup', UserController.create)

export default routes