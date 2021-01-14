import {Request, Response} from 'express'
import {getRepository} from 'typeorm'
import User from '../models/User'


export default {
    async create(req: Request, res: Response) {
        const {
            name,
            email,
            password
        } = req.body

        const userRepository = getRepository(User)

        const data = {
            name,
            email,
            password
        }

        try {
            const user = userRepository.create(data)
            await userRepository.save(user)
        } catch(error) {
            res.status(400).send({message: 'error creating user'})
        }

        return res.status(201).send()
    }
}