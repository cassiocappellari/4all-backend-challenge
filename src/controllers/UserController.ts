import {Request, Response} from 'express'
import {getRepository} from 'typeorm'
import User from '../models/User'
import Authenticator from '../services/Authenticator'

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
            const checkUserAuthentication = await Authenticator.userAuthenticate(req.body)

            if(checkUserAuthentication === 'user not found') return res.status(404).send({checkUserAuthentication})
            if(checkUserAuthentication === 'invalid password') return res.status(401).send({checkUserAuthentication})

            const token = await Authenticator.tokenGenerate(req.body)

            res.status(200).send({checkUserAuthentication, token})
        } catch(error) {
            return res.status(401).send({message: 'error authenticating user'})
        }
    },
    async logoff(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization as string
            await Authenticator.tokenDestroy(authHeader)

            res.status(200).send({message: 'User successfuly logged out'})
        } catch(error) {
            return res.status(401).send({message: 'error logging out user'})
        }
    }
}