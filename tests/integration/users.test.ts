import request from 'supertest'
import userRoutes from '../../src/routes/userRoutes'
import connection from '../../src/database/connection'

describe('', () => {
    beforeAll(async () => {
        await connection.create()
    })

    afterAll(async () => {
        await connection.close()
    })
    
    beforeEach(async () => {
        await connection.clear()
    })

    it('should create a new user with name, email and password', async () => {
        const response = await request(userRoutes)
        .post('/user/signup')
        .send({
            name: 'Cássio Teste 2',
            email: 'cassiocappellariteste2@gmail.com',
            password: '123456'
        })

        expect(response.status).toBe(201)
    })
})