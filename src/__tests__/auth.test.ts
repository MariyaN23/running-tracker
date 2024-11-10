import express, {Express} from "express";
import {authRouter} from "../routes/auth-route";
import request from "supertest";
import {authService} from "../services/auth-service";

jest.mock('../services/auth-service')

const app: Express = express()
app.use(express.json())
app.use('/auth', authRouter)

describe('POST /auth/register', () => {
    it('should register new user in app', async () => {
        const mockRegister = authService.register as jest.Mock
        const mockUser = { username: 'testuser' }

        mockRegister.mockResolvedValueOnce(mockUser)

        const response = await request(app)
            .post('/auth/register')
            .send({ username: 'testuser', password: 'password' })

        expect(response.status).toBe(200)
        expect(response.text).toBe('New user testuser registered')
        expect(mockRegister).toHaveBeenCalledWith('testuser', 'password')
    })

    it('should return an error if registration failed', async () => {
        const mockRegister = authService.register as jest.Mock
        mockRegister.mockRejectedValueOnce(new Error('Service error'))

        const response = await request(app)
            .post('/auth/register')
            .send({ username: 'testuser', password: 'password' })

        expect(response.status).toBe(400)
        expect(response.body.message).toContain('Registration error: Error: Service error')
    })
})

describe('POST /auth/login', () => {
    it('should log in a user successfully', async () => {
        const mockLogin = authService.login as jest.Mock
        const mockResult = { userId: '1', token: 'token' }

        mockLogin.mockResolvedValueOnce(mockResult)

        const response = await request(app)
            .post('/auth/login')
            .send({ username: 'testuser', password: 'password' })

        expect(response.status).toBe(200)
        expect(response.body).toEqual({ userId: '1', token: 'token' })
        expect(mockLogin).toHaveBeenCalledWith('testuser', 'password')
    })

    it('should return an error if login credentials are incorrect', async () => {
        const mockLogin = authService.login as jest.Mock
        mockLogin.mockResolvedValueOnce('Invalid credentials')

        const response = await request(app)
            .post('/auth/login')
            .send({ username: 'testuser', password: 'wrongpassword' })

        expect(response.status).toBe(400)
        expect(response.body.message).toContain('Login error')
    })

    it('should return an error if login fails', async () => {
        const mockLogin = authService.login as jest.Mock
        mockLogin.mockRejectedValueOnce(new Error('Service error'))

        const response = await request(app)
            .post('/auth/login')
            .send({ username: 'testuser', password: 'password' })

        expect(response.status).toBe(400)
        expect(response.body.message).toContain('Login error')
    })
})