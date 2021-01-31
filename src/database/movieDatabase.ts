import {getRepository, getConnection} from 'typeorm'
import Movie from '../models/Movie'

interface MovieInputDTO {
    id: number
    title: string
    director: string
    quantity: number
}

export default {
    async createMovie({title, director, quantity}: MovieInputDTO) {
        const movieRepository = getRepository(Movie)
        const movie = await movieRepository.findOne({title})

        if(movie) return 'movie already created'
    
        const movieData = {
            title,
            director,
            quantity
        }

        if(!title || !director || !quantity) return 'all fields are required'

        const createNewMovie = movieRepository.create(movieData)
        await movieRepository.save(createNewMovie)

        return 'movie successfully created'
    },
    async getAvailableMovies() {
        const movieRepository = getRepository(Movie) 
       
        const getMovies = await movieRepository
        .createQueryBuilder('movie')
        .where('movie.quantity != 0')
        .getMany()

        return getMovies
    },
    async filterByMovieTitle(title: MovieInputDTO) {
        if(!title) return 'movie title not provided'

        const movieRepository = getRepository(Movie)

        const findMovieByTitle = await movieRepository
        .createQueryBuilder('movie')
        .where('movie.title = :title', {title})
        .getMany()

        if(findMovieByTitle.length === 0) return 'movie not found'

        return findMovieByTitle
    },
    async rentMovie(id: MovieInputDTO, userId: Number) {
        const movieRepository = getRepository(Movie)

        const getMovieId = await movieRepository
        .createQueryBuilder('movie')
        .select('quantity')
        .where('movie.id = :id', {id})
        .getRawOne()
        if(getMovieId === undefined) return 'movie not found' 

        const findMovieById = await movieRepository.findOne(Number(id), {relations: ['users']})
        const findUserById = findMovieById?.users.find((user) => user.id === userId)
        if(findUserById !== undefined) return 'movie already rented'

        let movieAvailability = getMovieId.quantity
        if(movieAvailability === 0) return 'movie not available'
        --movieAvailability

        await getConnection()
        .createQueryBuilder()
        .update(Movie)
        .set({quantity: movieAvailability})
        .where('id = :id', {id})
        .execute()

        await getConnection()
        .createQueryBuilder()
        .relation(Movie, 'users')
        .of(Number(id))
        .add(userId)

        return 'movie rented successfuly'
    },
    async returnMovie(id: MovieInputDTO, userId: Number) {
        const movieRepository = getRepository(Movie)
            
        const getMovieId = await movieRepository
        .createQueryBuilder('movie')
        .select('quantity')
        .where('movie.id = :id', {id})
        .getRawOne()
        if(getMovieId === undefined) return 'movie not found'

        const findMovieById = await movieRepository.findOne(Number(id), {relations: ['users']})
        const findUserById = findMovieById?.users.find((user) => user.id === userId)
        if(findUserById === undefined) return 'movie already returned'

        let movieAvailability = getMovieId.quantity
        ++movieAvailability
        
        await getConnection()
        .createQueryBuilder()
        .update(Movie)
        .set({quantity: movieAvailability})
        .where('id = :id', {id})
        .execute()

        await getConnection()
        .createQueryBuilder()
        .relation(Movie, 'users')
        .of(Number(id))
        .remove(userId)

        return 'movie returned successfuly'
    }
}