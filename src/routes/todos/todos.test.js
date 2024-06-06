const request = require('supertest');
const app = require('../../index');

describe('Todos routes', () => {
    let token;

    beforeAll((done) => {
        request(app)
            .post('/auth/login')
            .send({
                email: 'test@test.com',
                password: 'password'
            })
            .end((err, response) => {
                token = response.body.token;
                done();
            });
    });

    test('GET /todos', () => {
        return request(app)
            .get('/todos')
            .set('Authorization', `Bearer ${token}`)
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(Array.isArray(response.body)).toBeTruthy();
            });
    });

    test('POST /todos', () => {
        return request(app)
            .post('/todos')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test Todo',
                description: 'This is a test todo',
                done: false
            })
            .then(response => {
                expect(response.statusCode).toBe(201);
                expect(response.body.msg).toEqual('Todo created successfully');
            });
    });
});
