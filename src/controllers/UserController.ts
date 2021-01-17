import {Request, Response} from 'express'
import {getRepository} from 'typeorm'
import User from '../models/User'
import bcrypt from 'bcryptjs'
import redis from 'redis'
import JWTR from 'jwt-redis'
const redisClient = redis.createClient()
const jwtr = new JWTR(redisClient)

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

            return res.status(201).send({message: 'user successfully created'})
        } catch(error) {
            console.log(error)
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
            if(!user) return res.status(404).send({error: 'user not found'})

            const isValidPassword = await bcrypt.compare(password, user.password)
            if(!isValidPassword) return res.status(401).send({error: 'invalid password'})

            const token = await jwtr.sign(
                {id: user.id, jti: user.id as unknown as string}, 
                String(process.env.JWT_KEY), 
                {expiresIn: String(process.env.JWT_EXPIRES_IN)})

            res.status(200).send({message: 'user successfuly logged in', token})
        } catch(error) {
            return res.status(401).send({message: 'error authenticating user'})
        }
    },
    async logoff(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization as string
            const token = authHeader.replace('Bearer', '').trim()
            const data = await jwtr.verify(token, String(process.env.JWT_KEY))
            const tokenId = data.jti as string

            await jwtr.destroy(tokenId)

            res.status(200).send({message: 'User successfuly logged out'})
        } catch(error) {
            return res.status(401).send({message: 'error logging out user'})
        }
    }
}