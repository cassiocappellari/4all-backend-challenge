import request from 'supertest'
import userRoutes from '../../src/routes/userRoutes'
import movieRoutes from '../../src/routes/movieRoutes'
import {connection} from '../../src/database/connection'

describe('User Routes', () => {
    beforeAll(async () => {
        await connection()
    })

    it('should create a new user with name, email and password', async () => {
        const response = await request(userRoutes)
        .post('/user/signup')
        .send({
            name: 'User Integration Test',
            email: 'userintegrationtest@gmail.com',
            password: '123456'
        })

        expect(response.status).toBe(201)
    })

    it('should authenticate user with valid credentials', async () => {
        await request(userRoutes)
        .post('/user/signup')
        .send({
            name: 'User Integration Test',
            email: 'userintegrationtest@gmail.com',
            password: '123456'
        })
        
        const response = await request(userRoutes)
        .post('/user/logon')
        .send({
            email: 'userintegrationtest@gmail.com',
            password: '123456'
        })

        expect(response.status).toBe(200)
    })

    it('should not authenticate user with invalid credentials', async () => {
        await request(userRoutes)
        .post('/user/signup')
        .send({
            name: 'User Integration Test',
            email: 'userintegrationtest@gmail.com',
            password: '123456'
        })
        
        const response = await request(userRoutes)
        .post('/user/logon')
        .send({
            email: 'userintegrationtest@gmail.com',
            password: '12345678'
        })

        expect(response.status).toBe(403)
    })

    it('should return jwt token when user is authenticated', async () => {
        await request(userRoutes)
        .post('/user/signup')
        .send({
            name: 'User Integration Test',
            email: 'userintegrationtest@gmail.com',
            password: '123456'
        })
        
        const response = await request(userRoutes)
        .post('/user/logon')
        .send({
            email: 'userintegrationtest@gmail.com',
            password: '123456'
        })

        expect(response.body).toHaveProperty('token')
    })

    it('should be able to access private routes when user is authenticated', async () => {
        const user = await request(userRoutes)
        .post('/user/logon')
        .send({
            email: 'userintegrationtest@gmail.com',
            password: '123456'
        })

        const token = user.body.token

        const response = await request(movieRoutes)
        .get('/movie/available')
        .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200)
    })

    it('should not be able to access private routes with invalid jwt token', async () => {
        const response = await request(movieRoutes)
        .get('/movie/available')
        .set('Authorization', `Bearer 123faketoken123`)

        expect(response.status).toBe(403)
    })

    it('should not be able to access private routes without jwt token', async () => {
        const response = await request(movieRoutes)
        .get('/movie/available')
        .set('Authorization', 'Bearer')

        expect(response.status).toBe(404)
    })
})