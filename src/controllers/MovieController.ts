import {Request, Response} from 'express'
import {getRepository} from 'typeorm'
import Movie from '../models/Movie'

export default {
    async createMovie(req: Request, res: Response) {
        const {
            title,
            director,
            quantity
        } = req.body

        const movieRepository = getRepository(Movie)

        const movieData = {
            title,
            director,
            quantity
        }

        try {
            const createNewMovie = movieRepository.create(movieData)
            await movieRepository.save(createNewMovie)
        } catch(error) {
            res.status(400).send({message: 'error creating movie'})
        }

        return res.status(201).send()
    },
    async getAvailableMovies(req: Request, res: Response) {
        res.send()
    },
    async filterByMovieTitle(req: Request, res: Response) {
        res.send()
    },
    async rentMovie(req: Request, res: Response) {
        res.send()
    },
    async returnMovie(req: Request, res: Response) {
        res.send()
    }
}