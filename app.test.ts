import { server } from './server';
import request  from 'supertest';
import dotenv from 'dotenv';
import * as cache from './cache';
import * as database from './database';
dotenv.config();

database.setupDatabase(process.env.DATABASE_URL || '');
cache.setupCache(process.env.REDIS_URL || '', 
                    process.env.REDIS_USER || '', process.env.REDIS_PWD || '');

afterAll(async () => {
    await database.terminatePool();  
    await new Promise<void>(resolve => setTimeout(() => resolve(), 2000));
})

test('POST /api/user/signup', async () => {

    try {
        const response = await request(server)
        .post('/api/user/signup')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({
            firstName: 'TestFirstName',
            lastName: 'TestLastName',
            email: 'testemail@scrawl.com',
            password: 'testPassword2402@#'
        }))

        console.log(response.body);
        expect(response.status).toBe(201);
    } catch (err) {
        throw err;
    }
});

