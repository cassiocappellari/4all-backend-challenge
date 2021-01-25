import request from 'supertest'
import userRoutes from '../../src/routes/userRoutes'
import {connection} from '../../src/database/connection'

describe('', () => {
    beforeAll(async () => {
        await connection()
    })

    it('should create a new user with name, email and password', async () => {
        const response = await request(userRoutes)
        .post('/user/signup')
        .send({
            name: 'Cássio Teste 3',
            email: 'cassiocappellariteste3@gmail.com',
            password: '123456'
        })

        expect(response.status).toBe(201)
    })
})