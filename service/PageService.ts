import * as entity from '../entity';
import * as database from '../database';
import * as errors from './errors';

export class PageService {

    private static instance: PageService;
    private constructor() {}

     // follows the singleton pattern
    public static getInstance(): PageService {

        if (!PageService.instance) {
            PageService.instance = new PageService();
        }

        return PageService.instance;
    }

    public async getPages(owner: string): Promise<entity.Page[]> {

        const pages = await database.getPages(owner);
        return pages;
    }

    public async deletePage(id: string, owner: string) {

        await database.deletePage(id, owner);
    }

    public async updatePageName(page: entity.Page) {
        
        if (this.isBlank(page.name)) {
            throw new errors.ErrPageNameBlank;
        }
        await database.updatePageName(page);
    }

    public async insertPage(page: entity.Page): Promise<string> {

        if (this.isBlank(page.name)) {
            throw new errors.ErrPageNameBlank;
        }
        await database.insertPage(page);
        return page.id;
    }

    private isBlank(input: string): boolean {

        let allBlank = true;
        for (let i = 0; i < input.length; ++i) {
            if (input[i] === ' ') {
                allBlank = false;
            }
        }

        return (input.length === 0 || allBlank);
    }
}
