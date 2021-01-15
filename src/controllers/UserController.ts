import {Request, Response} from 'express'
import {getRepository} from 'typeorm'
import User from '../models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import authToken from '../config/auth'

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
            if(checkDuplicatedUser) return res.status(409).send({error: 'user already exists'})
    
            const userData = {
                name,
                email,
                password
            }

            const signupUser = userRepository.create(userData)
            await userRepository.save(signupUser)

            return res.status(201).send()
        } catch(error) {
            return res.status(400).send({message: 'error creating user'})
        }
    },
    async logon(req: Request, res: Response) {
        try {
            const {
                email,
                password
            } = req.body

            const userRepository = getRepository(User)

            const user = await userRepository.findOne({email})
            if(!user) return res.status(401).send({error: 'user not found'})

            const isValidPassword = await bcrypt.compare(password, user.password)
            if(!isValidPassword) return res.status(401).send({error: 'invalid password'})

            const token = jwt.sign({id: user.id}, authToken, {expiresIn: '1d'})

            res.json({
                user,
                token
            })

        } catch(error) {
            return res.status(400).send({message: 'error authenticating user'})
        }
    },
    async logoff(req: Request, res: Response) {
        return res.send()
    }
}