const request = require('supertest');
const app = require('../../index');

describe('Auth routes', () => {
    test('POST /auth/login', () => {
        return request(app)
            .post('/auth/login')
            .send({
                email: 'test@test.com',
                password: 'password'
            })
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toHaveProperty('token');
            });
    });

    test('POST /auth/register', () => {
        return request(app)
            .post('/auth/register')
            .send({
                name: 'Test User',
                email: 'test2@test.com',
                password: 'password'
            })
            .then(response => {
                expect(response.statusCode).toBe(201);
                expect(response.body.msg).toEqual('User created successfully');
            });
    });
});
