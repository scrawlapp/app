import dotenv from 'dotenv';
dotenv.config();

import { deleteUser, insertUser, setupDatabase, terminatePool } from '.';
import * as entity from '../entity/';
import { insertAbility, getAllSharedPages, deleteAbility } from './ability';
import { deletePage, insertPage } from './page';

setupDatabase(process.env.DATABASE_URL || '');

const user: entity.User = {
    id: '',
    firstName: 'Stuart',
    lastName: 'Little',
    email: 'stuartlittle@gmail.com',
    password: 'broadpassword'
}

const secondUser: entity.User = {
    id: '',
    firstName: 'Second',
    lastName: 'User',
    email: 'seconduser@gmail.com',
    password: 'seconduser'
}

const page: entity.Page = { 
    id: '', 
    owner: user.id, 
    name: 'test-share-page' 
}

beforeAll(async () => {
    try {
        await insertUser(user);
        await insertUser(secondUser);
        page.owner = user.id;
        await insertPage(page);
    } catch (err) {
        throw err;
    }
})

afterAll(async () => {
    try {
        await deleteUser(secondUser.id);
        await deletePage(page.id, page.owner);
        await deleteUser(user.id);
        await terminatePool();
    } catch (err) {
        throw err;
    }
})


test('insert an ability and get shared pages', async () => {
    
    try {
        await insertAbility({
            pageId: page.id,
            userId: secondUser.id,
            ability: 'editor'
        });

        const sharedPages = await getAllSharedPages(secondUser.id);
        expect(sharedPages.length).toBe(1);
        expect(sharedPages[0].id).toBe(page.id);
        await deleteAbility(page.id, secondUser.id);
    } catch (err) {
        throw err;
    }
})
