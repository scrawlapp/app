import dotenv from 'dotenv';
dotenv.config();

import { deleteUser, insertUser, setupDatabase, terminatePool } from '.';
import * as entity from '../entity/';
import { deletePage, getPages, getSinglePage, insertPage, updatePageName } from './page';

setupDatabase(process.env.DATABASE_URL || '');

// dummy user for all tests
const user: entity.User = {
    id: '',
    firstName: 'Stuart',
    lastName: 'Doe',
    email: 'stuart@gmail.com',
    password: 'johnpassword'
}

beforeAll(async () => {
    try {
        await insertUser(user);
    } catch (err) {
        throw err;
    }
})

afterAll(async () => {
    try {
        await deleteUser(user.id);
        await terminatePool();
    } catch (err) {
        throw err;
    }
})

test('create page', async () => {

    try {
        const page: entity.Page = {
            id: '',
            owner: user.id,
            name: 'hello world',
        }
        await insertPage(page);
        await deletePage(page.id, page.owner);
    } catch (err) {
        throw err;
    }
});

test('get all pages of user', async () => {

    try {
        const pages: entity.Page[] = [
            { id: '', owner: user.id, name: 'one' },
            { id: '', owner: user.id, name: 'two' },
            { id: '', owner: user.id, name: 'three' },
        ]

        for (let i = 0; i < pages.length; ++i) {
            await insertPage(pages[i]);
        }

        const result = await getPages(user.id);

        if (pages.length !== result.length) {
            throw new Error('unequal content length');
        }

        const pageSortComparator = (first: entity.Page, second: entity.Page): number => {
            return first.name.localeCompare(second.name)
        }
        
        pages.sort(pageSortComparator);
        result.sort(pageSortComparator);
        
        for (let i = 0; i < result.length; ++i) {

            if (pages[i].name !== result[i].name) {
                    throw new Error('page mismatch');
            }
        }

        for (let i = 0; i < result.length; ++i) {
            await deletePage(result[i].id, user.id);
        }

    } catch (err) {
        throw err;
    }
});

test('update page name', async () => {

    try {
        const page: entity.Page = {
            id: '',
            owner: user.id,
            name: 'hello world!',
        }
        await insertPage(page);
        page.name = 'hello world updated!';
        await updatePageName(page);

        const result = await getPages(page.owner);

        if (result[0].name !== page.name) {
            throw new Error('page update name mismatch');
        }
        await deletePage(page.id, page.owner);
    } catch (err) {
        throw err;
    }
});

test('get a single page', async () => {

    try {
        const page: entity.Page = {
            id: '',
            owner: user.id,
            name: 'see if exists',
        }
        await insertPage(page);
        const pageFromDB = await getSinglePage(page.id);
        expect(page.id).toEqual(pageFromDB.id);
        await deletePage(page.id, page.owner);
    } catch (err) {
        throw err;
    }
});

test('delete a page', async () => {

    try {
        const page: entity.Page = {
            id: '',
            owner: user.id,
            name: 'to delete',
        }
        await insertPage(page);
        await deletePage(page.id, page.owner);
        const result = await getPages(page.owner);
        if (result.length !== 0) {
            throw new Error('expected nothing to return');
        }
    } catch (err) {
        throw err;
    }
});
