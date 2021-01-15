import {Request, Response} from 'express'
import {getRepository} from 'typeorm'
import User from '../models/User'
import bcrypt from 'bcryptjs'

export default {
    async signup(req: Request, res: Response) {
        try {
            const {
                name,
                email,
                password
            } = req.body

            const userRepository = getRepository(User)

            const checkDuplicatedUser = await userRepository.findOne({email})
            if(checkDuplicatedUser) return res.status(400).send({error: 'user already exists'})
    
            const hash = await bcrypt.hash(password, 10)
    
            const userData = {
                name,
                email,
                password: hash
            }

            const signupUser = userRepository.create(userData)
            await userRepository.save(signupUser)

            return res.status(201).send()
        } catch(error) {
            return res.status(400).send({message: 'error creating user'})
        }
    },
    async logon(req: Request, res: Response) {
        return res.send()
    },
    async logoff(req: Request, res: Response) {
        return res.send()
    }
}