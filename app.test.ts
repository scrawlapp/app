import { server } from './server';
import request  from 'supertest';
import dotenv from 'dotenv';
import * as cache from './cache';
import * as database from './database';
import * as entity from './entity';
import { UserService } from './service';
dotenv.config();

database.setupDatabase(process.env.DATABASE_URL || '');
cache.setupCache(process.env.REDIS_URL || '', 
                    process.env.REDIS_USER || '', process.env.REDIS_PWD || '');

const userService = UserService.getInstance();

const dummyUser: entity.User = {
    id: '',
    firstName: 'TestFirstName',
    lastName: 'TestLastName',
    email: 'testemail@scrawl.com',
    password: 'testPassword2402@#'
}

let cookie = '';
let secondCookie = '';

async function signup(path: string) {
    try {
        const unhashedPassword = dummyUser.password;
        const response = await request(server)
                                .post(path)
                                .set('Content-Type', 'application/json')
                                .send(JSON.stringify(dummyUser))
        expect(response.status).toBe(201);
        dummyUser.password = unhashedPassword;
    } catch (err) {
        throw err;
    }
}

async function login(path: string) {
    try{
        const response = await request(server)
            .post(path)
            .set('Content-Type', 'application/json')
            .send(JSON.stringify({
                email: dummyUser.email,
                password: dummyUser.password
            }));
        const cookies = response.header['set-cookie'][0].split(',').map((item: string) => item.split(';')[0]);
        cookie = cookies.join(';');
    } catch(err) {
        throw err;
    }
}

async function deleteAccount(path: string) {
    try {
        const response = await request(server)
                                .delete(path)
                                .set('Cookie', cookie)
                                .set('Content-Type', 'application/json')
                                
        expect(response.status).toBe(200);
    } catch (err) {
        throw err;
    }
}

async function updateFirstName(path: string) {
    try {
        dummyUser.firstName = dummyUser.firstName + 'Updated';
        const response = await request(server)
                                .put(path)
                                .set('Cookie', cookie)
                                .set('Content-Type', 'application/json')
                                .send(JSON.stringify({
                                    email: dummyUser.email,
                                    firstName: dummyUser.firstName
                                }));
        expect(response.status).toBe(204);
    } catch (err) {
        throw err;
    }
}

async function updateLastName(path: string) {
    try {
        dummyUser.lastName = dummyUser.lastName + 'Updated';
        const response = await request(server)
                                .put(path)
                                .set('Cookie', cookie)
                                .set('Content-Type', 'application/json')
                                .send(JSON.stringify({
                                    email: dummyUser.email,
                                    lastName: dummyUser.lastName
                                }));
        expect(response.status).toBe(204);
    } catch (err) {
        throw err;
    }
}

async function updatePassword(path: string) {
    try {
        const password = dummyUser.password + 'Updated';
        const response = await request(server)
                                .put(path)
                                .set('Cookie', cookie)
                                .set('Content-Type', 'application/json')
                                .send(JSON.stringify({
                                    email: dummyUser.email,
                                    oldPassword: dummyUser.password,
                                    newPassword: password
                                }));
        expect(response.status).toBe(204);
        dummyUser.password = password
    } catch (err) {
        throw err;
    }   
}

async function logout(path: string) {
    try {
        const response = await request(server)
                            .post(path)
                            .set('Cookie', cookie)
                            .set('Content-Type', 'application/json');
        expect(response.status).toBe(200);   
    } catch (err) {
        throw err;
    }
}

const dummyPage: entity.Page = {
    id: '',
    owner: '',
    name: 'someName'
}

async function createPage(path: string) {
    try {
        const response = await request(server)
                                .post(path)
                                .set('Cookie', cookie)
                                .set('Content-Type', 'application/json')
                                .send(JSON.stringify({
                                    name: dummyPage.name
                                }));
        expect(response.status).toBe(201);
        dummyPage.id = response.body.pageId;
    } catch (err) {
        throw err;
    }
}

async function deletePage(path: string) {
    try {
        const response = await request(server)
                                .delete(path)
                                .set('Cookie', cookie)
                                .set('Content-Type', 'application/json')
                                .send(JSON.stringify({
                                    pageId: dummyPage.id
                                }));
        expect(response.status).toBe(200);
    } catch (err) {
        throw err;
    }
}

async function getAllPages(path: string) {
    try {
        const response = await request(server)
                                .get(path)
                                .set('Cookie', cookie)
                                .set('Content-Type', 'application/json');
        expect(response.status).toBe(200);
    } catch (err) {
        throw err;
    }
}

async function updatePageName(path: string) {
    try {
        dummyPage.name = dummyPage.name + 'Updated';
        const response = await request(server)
                                .put(path)
                                .set('Cookie', cookie)
                                .set('Content-Type', 'application/json')
                                .send(JSON.stringify({
                                    pageId: dummyPage.id,
                                    name: dummyPage.name
                                }));
        expect(response.status).toBe(204);
    } catch (err) {
        throw err;
    }
}

const dummyBlock: entity.Block = {
    id: '',
    pageId: '',
    tag: 'h1',
    html: 'hello',
    position: 1,
    src: null,
    href: null,
}

async function insertBlock(path: string) {
    try {
        dummyBlock.pageId = dummyPage.id;
        const response = await request(server)
                                .post(path)
                                .set('Cookie', cookie)
                                .set('Content-Type', 'application/json')
                                .send(JSON.stringify(dummyBlock));
        expect(response.status).toBe(201);
        dummyBlock.id = response.body.id;
    } catch (err) {
        throw err;
    }
}

async function updateBlock(path: string) {
    try {
        dummyBlock.html = dummyBlock.html + 'Updated';
        const response = await request(server)
                                .put(path)
                                .set('Cookie', cookie)
                                .set('Content-Type', 'application/json')
                                .send(JSON.stringify(dummyBlock));
        expect(response.status).toBe(204);
    } catch (err) {
        throw err;
    }
}

async function getAllBlocks(path: string) {
    try {
        const response = await request(server)
                                .get(path + `/${dummyPage.id}`)
                                .set('Cookie', cookie)
                                .set('Content-Type', 'application/json');
        expect(response.status).toBe(200);
    } catch (err) {
        throw err;
    }
}

async function deleteBlock(path: string) {
    try {
        const response = await request(server)
                                .delete(path)
                                .set('Cookie', cookie)
                                .set('Content-Type', 'application/json')
                                .send(JSON.stringify({
                                    id: dummyBlock.id
                                }));
        expect(response.status).toBe(200);
    } catch (err) {
        throw err;
    }
}

const secondUser: entity.User = {
    id: '',
    firstName: 'Second',
    lastName: 'User',
    email: 'testseconduser@gmail.com',
    password: 'testPassword2402@#'
}

async function insertAbility(path: string) {
    try {
        const response = await request(server)
                                .post(path)
                                .set('Cookie', cookie)
                                .set('Content-Type', 'application/json')
                                .send(JSON.stringify({
                                    pageId: dummyPage.id,
                                    email: secondUser.email,
                                    ability: 'editor'
                                }));
        expect(response.status).toBe(201);                        
    } catch (err) {
        throw err;
    }
}

async function getAllSharedPages(path: string) {
    try {
        const response = await request(server)
                            .get(path)
                            .set('Cookie', `token=${secondCookie};`)
                            .set('Content-Type', 'application/json');
        expect(response.status).toBe(200);
    } catch (err) {
        throw err;
    }
}

async function deleteAbility(path: string) {
    try {
        const response = await request(server)
                                .delete(path)
                                .set('Cookie', cookie)
                                .set('Content-Type', 'application/json')
                                .send(JSON.stringify({
                                    pageId: dummyPage.id,
                                    email: secondUser.email,
                                }));
        expect(response.status).toBe(200);
    } catch (err) {
        throw err;
    }
}

test('HTTP API', async () => {
    try {
        await signup('/api/user/signup');
        await login('/api/user/login');
        await updateFirstName('/api/user/firstName');
        await updateLastName('/api/user/lastName');
        await updatePassword('/api/user/password');
        await createPage('/api/page');
        await getAllPages('/api/page/all');
        await updatePageName('/api/page');
        await insertBlock('/api/block');
        await updateBlock('/api/block');
        await getAllBlocks('/api/block/all');
        await deleteBlock('/api/block');
        const unhashedPassword = secondUser.password;
        await userService.signup(secondUser);
        await insertAbility('/api/ability');
        const { token } = await userService.login(secondUser.email, unhashedPassword);
        secondCookie = token;
        await getAllSharedPages('/api/ability/pages');
        await deleteAbility('/api/ability');
        await userService.deleteUser(secondUser.id);
        await deletePage('/api/page');
        await logout('/api/user/logout');
        // create an arbitrary 500ms gap so that the previously generated JWT 
        // can differ from the one to be generated
        await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
        await login('/api/user/login');
        await deleteAccount('/api/user');
    } catch (err) {
        throw err;
    }
});

