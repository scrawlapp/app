import dotenv from 'dotenv';
dotenv.config();

import { setupDatabase, terminatePool } from '.';
import * as entity from '../entity/';
import { deleteUser, getUser, insertUser, updateFirstName, updateLastName, updatePassword } from './user';


setupDatabase(process.env.DATABASE_URL || '');
afterAll(async () => await terminatePool())

test('insert/get/delete user', async () => {

    let user: entity.User = {
        id: '',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@gmail.com',
        password: 'johnpassword'
    }

    try {

        await insertUser(user);
        let u = await getUser(user.email);
        u.password = u.password.toString();
        expect(user).toEqual(u);
        deleteUser(user.id);
    } catch (err) {

        throw err;
    }
});

test('update user fields', async () => {

    let user: entity.User = {
        id: '',
        firstName: 'Alice',
        lastName: 'Wonderland',
        email: 'alice@gmail.com',
        password: 'alicepassword'
    }

    try {

        await insertUser(user);

        user.firstName = 'AliceUpdated';
        await updateFirstName(user.id, user.firstName);
        let u = await getUser(user.email);
        expect(u.firstName).toBe(user.firstName);


        user.lastName = 'WonderlandUpdated';
        await updateLastName(user.id, user.lastName);
        u = await getUser(user.email);
        expect(u.lastName).toBe(user.lastName);

        user.password = 'alicepasswordUpdated';
        await updatePassword(user.id, user.password);
        u = await getUser(user.email);
        expect(u.password.toString()).toBe(user.password);

        await deleteUser(user.id);
    } catch (err) {
        
        throw err;
    }
});