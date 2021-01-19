import {Request, Response} from 'express'
import Authenticator from '../services/Authenticator'
import userDatabase from '../database/userDatabase'

export default {
    async signup(req: Request, res: Response) {
        try {
            const userSignUpStatus = await userDatabase.UserSignUp(req.body)
    
            if(userSignUpStatus === 'user already exists') return res.status(400).send({userSignUpStatus})
            if(userSignUpStatus === 'all fields are required') return res.status(400).send({userSignUpStatus})
            if(userSignUpStatus === 'password must have at least six characters') return res.status(400).send({userSignUpStatus})

            const token = await Authenticator.tokenGenerate(req.body)

            return res.status(201).send({userSignUpStatus, token})
        } catch(error) {
            return res.status(400).send({message: 'error creating user, contact your system administrator'})
        }
    },
    async logon(req: Request, res: Response) {
        try {
            const userAuthenticationStatus = await Authenticator.userAuthenticate(req.body)

            if(userAuthenticationStatus === 'user not found') return res.status(404).send({userAuthenticationStatus})
            if(userAuthenticationStatus === 'all fields are required') return res.status(400).send({userAuthenticationStatus})
            if(userAuthenticationStatus === 'invalid password') return res.status(403).send({userAuthenticationStatus})

            const token = await Authenticator.tokenGenerate(req.body)

            res.status(200).send({userAuthenticationStatus, token})
        } catch(error) {
            return res.status(401).send({message: 'error authenticating user, contact your system administrator'})
        }
    },
    async logoff(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization as string
            const userTokenStatus = await Authenticator.tokenDestroy(authHeader)

            if(userTokenStatus === 'token not provided') return res.status(404).send({userTokenStatus})
            if(userTokenStatus === 'invalid token') return res.status(403).send({userTokenStatus})

            res.status(200).send({userTokenStatus})
        } catch(error) {
            return res.status(401).send({message: 'error logging out user, contact your system administrator'})
        }
    }
}