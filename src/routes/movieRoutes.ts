import {Router} from 'express'

import authMiddleware from '../middlewares/authMiddleware'
import MovieController from '../controllers/MovieController'

const routes = Router()

routes.post('/movie/create', authMiddleware, MovieController.createMovie)
routes.get('/movie/available', authMiddleware, MovieController.getAvailableMovies)
routes.get('/movie/filter', authMiddleware, MovieController.filterByMovieTitle)
routes.put('/movie/rent/:id', authMiddleware, MovieController.rentMovie)
routes.put('/movie/return/:id', authMiddleware, MovieController.returnMovie)

export default routes