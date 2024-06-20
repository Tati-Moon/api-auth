const express = require('express');
const request = require('supertest');

const {verifyInputValue} = require('../../../../app/middleware');
const controller = require('../../../../app/controllers/auth.controller');
const authRoutes = require('../../../../app/routes/auth.routes');

const CONSTANTS = require('../utils/constants');

jest.mock('../../../../app/middleware', () => ({
    verifyInputValue: {
        checkRolesExisted: jest.fn((req, res, next) => next()),
        checkInputUserValue: jest.fn((req, res, next) => next()),
    },
}));

jest.mock('../../../../app/controllers/auth.controller', () => ({
    registration: jest.fn((req, res) =>
        res.status(200).send({message: 'User was registered successfully!'}),
    ),
    signin: jest.fn((req, res) =>
        res.status(200).send({
            id: 1,
            username: 'TestUser',
            email: 'testuser@example.com',
            roles: ['ROLE_USER'],
            accessToken: 'testToken',
        }),
    ),
}));

describe('Auth Routes', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/api-auth/auth', authRoutes());
    });

    test('POST /api-auth/auth/registration - should register a new user', async () => {
        const response = await request(app)
            .post('/api-auth/auth/registration')
            .send({
                firstName: 'Test',
                lastName: 'Test',
                email: 'test@test.com',
                username: 'TestUser',
                password: 'password123',
                phone: '+375 29 123 45 67',
                roles: ['user'],
            });
        expect(response.status).toBe(CONSTANTS.HTTP_STATUS.OK);
        expect(response.body.message).toBe('User was registered successfully!');
        expect(controller.registration).toHaveBeenCalled();
    });

    test('POST /api-auth/auth/registration - should call middleware', async () => {
        await request(app)
            .post('/api-auth/auth/registration')
            .send({
                firstName: 'Test',
                lastName: 'Test',
                email: 'test@test.com',
                username: 'TestUser',
                password: 'password123',
                phone: '+375 29 123 45 67',
                roles: ['user'],
            });
        expect(verifyInputValue.checkRolesExisted).toHaveBeenCalled();
        expect(verifyInputValue.checkInputUserValue).toHaveBeenCalled();
    });

    test('POST /api-auth/auth/signin - should sign in a user', async () => {
        const response = await request(app).post('/api-auth/auth/signin').send({
            username: 'TestUser',
            password: 'password123',
        });
        expect(response.status).toBe(CONSTANTS.HTTP_STATUS.OK);
        expect(response.body).toEqual({
            id: 1,
            username: 'TestUser',
            email: 'testuser@example.com',
            roles: ['ROLE_USER'],
            accessToken: 'testToken',
        });
        expect(controller.signin).toHaveBeenCalled();
    });
});
