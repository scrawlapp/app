import dotenv from 'dotenv';
import * as database from '../database';
import { BlockService } from './BlockService';
import * as entity from '../entity';
dotenv.config();

database.setupDatabase(process.env.DATABASE_URL || '');

const blockService = BlockService.getInstance();

// dummy user for all tests
const user: entity.User = {
    id: '',
    firstName: 'Stuart',
    lastName: 'Binny',
    email: 'binny22@gmail.com',
    password: 'binnypassword'
}

const page: entity.Page = { 
    id: '', 
    owner: user.id, 
    name: 'test-page-22' 
}

beforeAll(async () => {
    try {
        await database.insertUser(user);
        page.owner = user.id;
        await database.insertPage(page);
    } catch (err) {
        throw err;
    }
})

afterAll(async () => {
    try {
        await database.deletePage(page.id, page.owner);
        await database.deleteUser(user.id)
        await database.terminatePool();
    } catch (err) {
        throw err;
    }
})


test('CRUD from the BlockService', async () => {

    try {

        const block: entity.Block = {
            id: '',
            pageId: page.id,
            tag: 'h1',
            html: 'hello',
            position: 1,
            src: null,
            href: null,
        }


        await blockService.insertBlock(block);

        if (block.id === '') {
            throw new Error('no id');
        }
        const result = await blockService.getAllBlocks(page.id);
        if (result.length !== 1 && result[0].id !== block.id) {
            throw new Error('something went wrong');
        }
        block.html = 'feeling lucky updated!';
        await blockService.updateBlock(block);
        await blockService.deleteBlock(block.id)
    } catch (err) {
        throw err;
    }
});

