import {Request, Response, NextFunction} from 'express'
import {getRepository} from 'typeorm'
import User from '../models/User'
import bcrypt from 'bcryptjs'
import redis from 'redis'
import JWTR from 'jwt-redis'
const redisClient = redis.createClient()
const jwtr = new JWTR(redisClient)

interface UserAuthenticationDTO {
    id: number
    email: string
    password: string
}

interface TokenPayloadDTO {
    id: string
    iat: number
    exp: number
    jti: string
}

export default {
    async authRoutesMiddleware(req: Request, res: Response, next: NextFunction) {
        try {
            const authHeader = req.headers.authorization as string
            const token = authHeader.replace('Bearer', '').trim()

            if(!token) return res.status(404).send({message: 'token not provided'})
        
            const data = await jwtr.verify(token, String(process.env.JWT_KEY))
            const {id} = data as TokenPayloadDTO
            req.userId = id

            return next()
        } catch(error) {
            return res.status(403).send({message: 'invalid token'})
        }
    },
    async userAuthenticate({email, password}: UserAuthenticationDTO) {
        const userRepository = getRepository(User)

        const user = await userRepository.findOne({email})

        if(!user) return 'user not found'
        if(!email || !password) return 'all fields are required'

        const isValidPassword = await bcrypt.compare(password, user.password)
        if(!isValidPassword) return 'invalid password'

        return 'user successfuly logged in'
    },
    async tokenGenerate({email}: UserAuthenticationDTO) {
        const userRepository = getRepository(User)
        const user = await userRepository.findOne({email})
        if(user) {
            const token = await jwtr.sign(
                {
                    id: user.id, 
                    jti: user.id as unknown as string
                }, 
                String(process.env.JWT_KEY),
                {
                    expiresIn: String(process.env.JWT_EXPIRES_IN)
                }
            )
            return token
        }
    },
    async tokenDestroy(userToken: string) {
        const token = userToken.replace('Bearer', '').trim()
        if(!token) return 'token not provided'

        const data = await jwtr.verify(token, String(process.env.JWT_KEY))
        if(!data) return 'invalid token'

        const tokenId = data.jti as string
        await jwtr.destroy(tokenId)

        return 'user successfuly logged out'
    }
}