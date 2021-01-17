import {getRepository} from 'typeorm'
import User from '../models/User'

interface UserInputDTO {
    id: number
    name: string
    email: string
    password: string
}

export default {
    async UserSignUp({name, email, password}: UserInputDTO) {
        const userRepository = getRepository(User)

        const checkDuplicatedUser = await userRepository.findOne({email})
        if(checkDuplicatedUser) return 'user already exists'

        const userData = {
            name,
            email,
            password
        }

        const signupUser = userRepository.create(userData)
        await userRepository.save(signupUser)

        return 'user successfully created'
    }
}