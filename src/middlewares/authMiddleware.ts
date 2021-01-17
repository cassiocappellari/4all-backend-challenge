import {Request, Response, NextFunction} from 'express'
import redis from 'redis'
import JWTR from 'jwt-redis'
const redisClient = redis.createClient()
const jwtr = new JWTR(redisClient)

interface TokenPayload {
    id: string
    iat: number
    exp: number
    jti: string
}

export default async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization
    if(!authHeader) return res.send(401).send({message: 'Token not provided'})

    const token = authHeader.replace('Bearer', '').trim()

    try {
        const data = await jwtr.verify(token, String(process.env.JWT_KEY))
        const {id} = data as TokenPayload
        req.userId = id

        return next()
    } catch(error) {
        return res.status(401).send({message: 'Invalid token'})
    }
}