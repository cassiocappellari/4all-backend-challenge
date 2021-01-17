import {Router} from 'express'
import authMiddleware from '../services/Authenticator'
import MovieController from '../controllers/MovieController'

const routes = Router()

routes.use(authMiddleware.authRoutesMiddleware)
routes.post('/movie/create', MovieController.createMovie)
routes.get('/movie/available', MovieController.getAvailableMovies)
routes.get('/movie/filter', MovieController.filterByMovieTitle)
routes.put('/movie/rent/:id', MovieController.rentMovie)
routes.put('/movie/return/:id', MovieController.returnMovie)

export default routes