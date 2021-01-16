import {Request, Response} from 'express'
import {getRepository} from 'typeorm'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User'

export default {
    async passwordAuthenticate(password: String, email: String) {
        const userRepository = getRepository(User)
        const user = await userRepository.findOne()

        // const isValidPassword = await bcrypt.compare(password, user?.password)

        // retornar true ou false
    },
    tokenGenerate() {
        // retornar um token
    }
}