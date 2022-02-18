import * as entity from '../entity';
import * as database from '../database';

export class BlockService {

    private static instance: BlockService;
    private constructor() {}

     // follows the singleton pattern
    public static getInstance(): BlockService {

        if (!BlockService.instance) {
            BlockService.instance = new BlockService();
        }

        return BlockService.instance;
    }

    public async getAllBlocks(pageId: string): Promise<entity.Block[]> {

        const blocks = await database.getAllBlocks(pageId);
        return blocks;
    }

    public async deleteBlock(id: string) {

        await database.deleteBlock(id);
    }

    public async updateBlock(block: entity.Block) {
        
        await database.updateBlock(block);
    }

    public async insertBlock(block: entity.Block): Promise<string> {

        await database.insertBlock(block);
        return block.id;
    }
}
