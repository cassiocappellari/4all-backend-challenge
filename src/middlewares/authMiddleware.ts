import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'

interface TokenPayload {
    id: string
    iat: number
    exp: number
}

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization

    if(!authHeader) return res.send(401).send({message: 'Token not provided'})

    const token = authHeader.replace('Bearer', '').trim()

    try {
        const data = jwt.verify(token, process.env.JWT_KEY as string) // no método jwt.verify() passamos o token informado pelo usuário no header da requisição e o secret da aplicação

        const {id} = data as TokenPayload

        req.userId = id

        return next()
    } catch(err) {
        return res.status(401).send({message: 'Invalid token'})
    }
}