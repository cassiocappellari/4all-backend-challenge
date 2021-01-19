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
        const user = await userRepository.findOne({email})

        if(user) return 'user already exists'

        const userData = {
            name,
            email,
            password
        }

        if(!name || !email || !password) return 'all fields are required'
        if(password.length < 6) return 'password must have at least six characters'

        const signupUser = userRepository.create(userData)
        await userRepository.save(signupUser)

        return 'user successfully created'
    }
}