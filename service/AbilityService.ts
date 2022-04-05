import * as entity from '../entity';
import * as database from '../database';

export class AbilityService {

    private static instance: AbilityService;
    private constructor() {}

     // follows the singleton pattern
    public static getInstance(): AbilityService {

        if (!AbilityService.instance) {
            AbilityService.instance = new AbilityService();
        }

        return AbilityService.instance;
    }

    public async getAllSharedPages(userId: string): Promise<database.SharedPage[]> {

        const sharedPages = await database.getAllSharedPages(userId);
        return sharedPages;
    }

    public async deleteAbility(pageId: string, userId: string) {

        await database.deleteAbility(pageId, userId);
    }

    public async insertAbility(pageId: string, email: string, ability: string) {

        const user = await database.getUser(email);
        await database.insertAbility({
            pageId,
            userId: user.id,
            ability
        });
    }
}
