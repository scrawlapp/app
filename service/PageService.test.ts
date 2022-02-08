import dotenv from 'dotenv';
import * as database from '../database';
import { PageService } from './PageService';
import * as entity from '../entity';
dotenv.config();

database.setupDatabase(process.env.DATABASE_URL || '');

const pageService = PageService.getInstance();

// dummy user for all tests
const user: entity.User = {
    id: '',
    firstName: 'Stuart',
    lastName: 'Binny',
    email: 'binny@gmail.com',
    password: 'binnypassword'
}

beforeAll(async () => {
    try {
        await database.insertUser(user);
    } catch (err) {
        throw err;
    }
})

afterAll(async () => {
    try {
        await database.deleteUser(user.id);
        await database.terminatePool();
    } catch (err) {
        throw err;
    }
})


test('CRUD from the PageService', async () => {

    try {

        const page: entity.Page = {
            id: '',
            owner: user.id,
            name: 'feeling lucky',
        }

        await pageService.insertPage(page);

        if (page.id === '') {
            throw new Error('no id');
        }
        const result = await pageService.getPages(user.id);
        if (result.length !== 1 && result[0].name !== page.name) {
            throw new Error('something went wrong');
        }
        page.name = 'feeling lucky updated!';
        await pageService.updatePageName(page);
        await pageService.deletePage(page.id, page.owner);
    } catch (err) {
        throw err;
    }
});

