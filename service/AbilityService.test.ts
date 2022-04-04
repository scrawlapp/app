import dotenv from 'dotenv';
import * as database from '../database';
import { AbilityService } from './AbilityService';
import * as entity from '../entity';
dotenv.config();

database.setupDatabase(process.env.DATABASE_URL || '');

const abilityService = AbilityService.getInstance();

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
        await database.insertUser(user);
        await database.insertUser(secondUser);
        page.owner = user.id;
        await database.insertPage(page);
    } catch (err) {
        throw err;
    }
})

afterAll(async () => {
    try {
        await database.deleteUser(secondUser.id);
        await database.deletePage(page.id, page.owner);
        await database.deleteUser(user.id);
        await database.terminatePool();
    } catch (err) {
        throw err;
    }
})


test('CRUD from the AbilityService', async () => {
    
    try {
        await abilityService.insertAbility({
            pageId: page.id,
            userId: secondUser.id,
            ability: 'editor'
        });

        const sharedPages = await abilityService.getAllSharedPages(secondUser.id);
        expect(sharedPages.length).toBe(1);
        expect(sharedPages[0].id).toBe(page.id);
        await abilityService.deleteAbility(page.id, secondUser.id);
    } catch (err) {
        throw err;
    }
})
