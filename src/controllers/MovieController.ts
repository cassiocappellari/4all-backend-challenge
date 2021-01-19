import {Request, Response} from 'express'
import movieDatabase from '../database/movieDatabase'

export default {
    async createMovie(req: Request, res: Response) {
        try {
            const createMovieStatus = await movieDatabase.createMovie(req.body)

            if(createMovieStatus === 'movie already created') return res.status(400).send({createMovieStatus})
            if(createMovieStatus === 'all fields are required') return res.status(400).send({createMovieStatus})

            return res.status(201).send({createMovieStatus})
        } catch(error) {
            return res.status(400).send({message: 'error creating movie, contact your system administrator'})
        }
    },
    async getAvailableMovies(req: Request, res: Response) {
        try {
            const getMoviesStatus = await movieDatabase.getAvailableMovies()

            return res.status(200).send(getMoviesStatus)
        } catch(error) {
            return res.status(400).send({message: 'error getting movie, contact your system administrator'})
        }
    },
    async filterByMovieTitle(req: Request, res: Response) {
        try {
            const findMovieByTitleStatus = await movieDatabase.filterByMovieTitle(req.query.title as any)

            if(findMovieByTitleStatus === 'movie title not provided') return res.status(400).send({findMovieByTitleStatus})
            if(findMovieByTitleStatus === 'movie not found') return res.status(404).send({findMovieByTitleStatus})

            return res.status(200).send(findMovieByTitleStatus)
        } catch(error) {
            return res.status(400).send({message: 'error filtering movie, contact your system administrator'})
        }
    },
    async rentMovie(req: Request, res: Response) {
        try {
            const rentMovieStatus = await movieDatabase.rentMovie(req.params.id as any)

            if(rentMovieStatus === 'movie not found') return res.status(404).send({rentMovieStatus})
            if(rentMovieStatus === 'movie not available') return res.status(404).send({rentMovieStatus})

            return res.status(200).send({rentMovieStatus})
        } catch(error) {
            return res.status(400).send({message: 'error renting movie, contact your system administrator'})
        }
    },
    async returnMovie(req: Request, res: Response) {
        try {
            const returnMovieStatus = await movieDatabase.returnMovie(req.params.id as any)

            if(returnMovieStatus === 'movie not found') return res.status(404).send({returnMovieStatus})

            return res.status(200).send({returnMovieStatus})
        } catch(error) {
            return res.status(400).send({message: 'error returning movie, contact your system administrator'})
        }
    }
}