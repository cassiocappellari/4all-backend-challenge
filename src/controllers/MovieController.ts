import {Request, Response} from 'express'
import {getRepository, getConnection} from 'typeorm'
import Movie from '../models/Movie'

export default {
    async createMovie(req: Request, res: Response) {
        try {
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
            const createNewMovie = movieRepository.create(movieData)
            await movieRepository.save(createNewMovie)

            return res.status(201).send()
        } catch(error) {
            res.status(400).send({message: 'error creating movie'})
        }
    },
    async getAvailableMovies(req: Request, res: Response) {
        try {
            const movieRepository = getRepository(Movie)        
            const getMovies = await movieRepository
            .createQueryBuilder()
            .getMany()

            return res.status(200).send(getMovies)
        } catch(error) {
            res.status(400).send({message: 'error getting movie'})
        }
    },
    async filterByMovieTitle(req: Request, res: Response) {
        try {
            const movieTitle = req.params.title

            const movieRepository = getRepository(Movie)
            const findMovieByTitle = await movieRepository
            .createQueryBuilder('movie')
            .where('movie.title = title', {title: movieTitle})
            .getOne()

            return res.status(200).send(findMovieByTitle)
        } catch(error) {
            res.status(400).send({message: 'movie not found'})
        }
    },
    async rentMovie(req: Request, res: Response) {
        try {
            const movieId = req.params.id

            const movieRepository = getRepository(Movie)
            
            const getMovieId = await movieRepository
            .createQueryBuilder('movie')
            .select('quantity')
            .where('movie.id = :id', {id: movieId})
            .getRawOne()

            let movieAvailability = getMovieId.quantity
            
            if(movieAvailability === 0) {
                res.status(400).send({message: 'film not available'})
            }

            --movieAvailability

            await getConnection()
            .createQueryBuilder()
            .update(Movie)
            .set({quantity: movieAvailability})
            .where('id = :id', {id: movieId})
            .execute()

            res.status(200).send({message: "movie rented successfuly"})
        } catch(error) {
            console.log(error)
            res.status(400).send({message: 'error renting movie'})
        }
    },
    async returnMovie(req: Request, res: Response) {
        try {
            const movieId = req.params.id

            const movieRepository = getRepository(Movie)
            
            const getMovieId = await movieRepository
            .createQueryBuilder('movie')
            .select('quantity')
            .where('movie.id = :id', {id: movieId})
            .getRawOne()

            let movieAvailability = getMovieId.quantity
            ++movieAvailability

            await getConnection()
            .createQueryBuilder()
            .update(Movie)
            .set({quantity: movieAvailability})
            .where('id = :id', {id: movieId})
            .execute()

            res.status(200).send({message: "movie returned successfuly"})
        } catch(error) {
            console.log(error)
            res.status(400).send({message: 'error returning movie'})
        }
    }
}