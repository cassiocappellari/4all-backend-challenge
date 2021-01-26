import request from 'supertest'
import User from '../../src/models/User'
import userRoutes from '../../src/routes/userRoutes'
import connection from '../../src/database/connection'
import {getRepository} from 'typeorm'
import bcrypt from 'bcryptjs'

describe('User', () => {
    beforeAll(async () => {
        await connection.create()
    })

    afterAll(async () => {
        await connection.close()
    })

    it('should encrypt user password', async () => {
        await request(userRoutes)
        .post('/user/signup')
        .send({
            name: 'User Integration Test',
            email: 'userintegrationtest@gmail.com',
            password: '123456'
        })

        const userRepository = getRepository(User)
        const user = await userRepository.findOne()

        const compareHash = await bcrypt.compare('123456', user?.password as string) 

        expect(compareHash).toBe(true)
    })
})