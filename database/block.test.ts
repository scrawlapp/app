import dotenv from 'dotenv';
dotenv.config();

import { deleteUser, insertUser, setupDatabase, terminatePool } from '.';
import * as entity from '../entity/';
import { deleteBlock, getAllBlocks, insertBlock, updateBlock } from './block';
import { deletePage, insertPage } from './page';

setupDatabase(process.env.DATABASE_URL || '');

// dummy user for all tests
const user: entity.User = {
    id: '',
    firstName: 'Stuart',
    lastName: 'Broad',
    email: 'stuartbroad@gmail.com',
    password: 'broadpassword'
}

const page: entity.Page = { 
    id: '', 
    owner: user.id, 
    name: 'test-page' 
}

beforeAll(async () => {
    try {
        await insertUser(user);
        page.owner = user.id;
        await insertPage(page);
    } catch (err) {
        throw err;
    }
})

afterAll(async () => {
    try {
        await deletePage(page.id, page.owner);
        await deleteUser(user.id);
        await terminatePool();
    } catch (err) {
        throw err;
    }
})

function shallowEqual(object1: any, object2: any) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (let key of keys1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }
    return true;
  }

test('insert a block', async () => {

    try {
        const block: entity.Block = {
            id: '',
            pageId: page.id,
            tag: 'p',
            html: 'hello',
            position: 1,
            src: null,
            href: null,
        }

        await insertBlock(block);
        await deleteBlock(block.id);
    } catch (err) {
        throw err;
    }
});

test('get a block', async () => {

    try {
        const block: entity.Block = {
            id: '',
            pageId: page.id,
            tag: 'p',
            html: 'hello',
            position: 1,
            src: null,
            href: null,
        }

        await insertBlock(block);
        const blocks = await getAllBlocks(page.id);
        if (!shallowEqual(block, blocks[0])) {
            console.log(block);
            console.log(blocks[0]);
            throw new Error('properties do not match');
        }
        await deleteBlock(block.id);
    } catch (err) {
        throw err;
    }
});

test('update a block', async () => {

    try {
        const block: entity.Block = {
            id: '',
            pageId: page.id,
            tag: 'p',
            html: 'hello',
            position: 1,
            src: null,
            href: null,
        }
        await insertBlock(block);
        block.html = 'how are you';
        await updateBlock(block);
        const blocks = await getAllBlocks(page.id);
        if (!shallowEqual(block, blocks[0])) {
            console.log(block);
            console.log(blocks[0]);
            throw new Error('properties do not match');
        }
        await deleteBlock(block.id);
    } catch (err) {
        throw err;
    }
});
