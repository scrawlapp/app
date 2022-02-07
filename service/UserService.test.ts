import dotenv from 'dotenv';
import * as cache from '../cache';
import * as database from '../database';
import { UserService } from './UserService';
import * as entity from '../entity';
dotenv.config();

database.setupDatabase(process.env.DATABASE_URL || '');
cache.setupCache(process.env.REDIS_URL || '', 
                    process.env.REDIS_USER || '', process.env.REDIS_PWD || '');

afterAll(async () => await database.terminatePool())

const userService = UserService.getInstance();

test('sign up', async () => {

    try {
        let user: entity.User = {
            id: '',
            firstName: 'Aman',
            lastName: 'Bansal',
            email: 'aman@gmail.com',
            password: 'Amanpassword2402@'
        };

        await userService.signup(user);
        await userService.deleteUser(user.id);
    } catch (err) {
        throw err;
    }
});

test('login', async () => {

    try {
        let user: entity.User = {
            id: '',
            firstName: 'Naman',
            lastName: 'Bansal',
            email: 'naman@gmail.com',
            password: 'Namanpassword2402@'
        };

        const unhashedPassword = user.password;
        await userService.signup(user);
        const { token } = await userService.login(user.email, unhashedPassword);
        const decoded = await userService.verifyAndDecodeJWT(token);
        
        if (decoded === undefined) {
            throw new Error('Could not verify.');
        }

        expect(decoded.userId).toBe(user.id);
        await userService.deleteUser(user.id);
    } catch (err) {
        throw err;
    }
});

test('logout', async () => {

    try {
        let user: entity.User = {
            id: '',
            firstName: 'Aman',
            lastName: 'Mittal',
            email: 'aman.mittal@me.com',
            password: 'Amanpassword2402@'
        };

        const unhashedPassword = user.password;
        await userService.signup(user);
        const { token } = await userService.login(user.email, unhashedPassword);
        await userService.logout(token);
        
        await userService.deleteUser(user.id);
        const cacheClient = cache.getClient();
        if (cacheClient.isOpen) {
            cacheClient.disconnect();
        }
    } catch (err) {
        throw err;
    }
});

test('update user fields', async () => {

    let user: entity.User = {
        id: '',
        firstName: 'Alice',
        lastName: 'Wonderland',
        email: 'alice.returns@gmail.com',
        password: 'Alicepassword24@'
    }

    try {

        const unhashedPassword = user.password;
        await userService.signup(user);

        user.firstName = 'AliceUpdated';
        await userService.updateFirstName(user.email, user.firstName);
        let u = await database.getUser(user.email);
        expect(u.firstName).toBe(user.firstName);


        user.lastName = 'WonderlandUpdated';
        await userService.updateLastName(user.email, user.lastName);
        u = await database.getUser(user.email);
        expect(u.lastName).toBe(user.lastName);

        user.password = 'alicepasswordUpdated';
        await userService.updatePassword(user.email, unhashedPassword, user.password);
        await userService.login(user.email, user.password);
        await userService.deleteUser(user.id);
    } catch (err) {
        
        throw err;
    }
});

