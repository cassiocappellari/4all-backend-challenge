import {Request, Response} from 'express'
import movieDatabase from '../database/movieDatabase'

export default {
    async createMovie(req: Request, res: Response) {
        try {
            const createMovieStatus = await movieDatabase.createMovie(req.body)

            return res.status(201).send({createMovieStatus})
        } catch(error) {
            return res.status(400).send({message: 'error creating movie'})
        }
    },
    async getAvailableMovies(req: Request, res: Response) {
        try {
            const getMoviesStatus = await movieDatabase.getAvailableMovies()

            return res.status(200).send(getMoviesStatus)
        } catch(error) {
            return res.status(400).send({message: 'error getting movie'})
        }
    },
    async filterByMovieTitle(req: Request, res: Response) {
        try {
            const findMovieByTitleStatus = await movieDatabase.filterByMovieTitle(req.query.title as any)
            if(findMovieByTitleStatus === 'movie not found') return res.status(404).send({findMovieByTitleStatus})

            return res.status(200).send(findMovieByTitleStatus)
        } catch(error) {
            return res.status(400).send({message: 'error filtering movie'})
        }
    },
    async rentMovie(req: Request, res: Response) {
        try {
            const rentMovieStatus = await movieDatabase.rentMovie(req.params.id as any)

            if(rentMovieStatus === 'movie not available') return res.status(400).send({rentMovieStatus})

            return res.status(200).send({rentMovieStatus})
        } catch(error) {
            return res.status(400).send({message: 'error renting movie'})
        }
    },
    async returnMovie(req: Request, res: Response) {
        try {
            const returnMovieStatus = await movieDatabase.returnMovie(req.params.id as any)

            return res.status(200).send({returnMovieStatus})
        } catch(error) {
            return res.status(400).send({message: 'error returning movie'})
        }
    }
}