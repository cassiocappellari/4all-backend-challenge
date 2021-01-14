import {Request, Response} from 'express'
import {getRepository} from 'typeorm'
import User from '../models/User'
import bcrypt from 'bcryptjs'

export default {
    async signup(req: Request, res: Response) {
        const {
            name,
            email,
            password
        } = req.body

        const hash = await bcrypt.hash(password, 10)
        const userRepository = getRepository(User)

        const userData = {
            name,
            email,
            password: hash
        }

        try {
            const signupUser = userRepository.create(userData)
            await userRepository.save(signupUser)
        } catch(error) {
            res.status(400).send({message: 'error creating user'})
        }

        return res.status(201).send()
    },
    async logon(req: Request, res: Response) {
        return res.send()
    },
    async logoff(req: Request, res: Response) {
        return res.send()
    }
}