import * as entity from '../entity/';
import { v4 as uuidv4 } from 'uuid';
import { QueryResult } from 'pg';
import { execWithTransaction, queryWithTransaction } from '.';

const statementSelectBlocks = `select * from blocks where "pageId" = $1`;
const statementInsertBlock = `insert into blocks (id, "pageId", tag, html, position, href, src) values ($1, $2, $3, $4, $5, $6, $7)`;
const statementDeleteBlock = "delete from blocks where id = $1";
const statementUpdateBlock = "update blocks set tag = $1, html = $2, position = $3, src = $4, href = $5 where id = $6"; 

// insert a block
export async function insertBlock(block: entity.Block) {

    block.id = uuidv4();
    await execWithTransaction(statementInsertBlock, block.id, block.pageId, block.tag, block.html, block.position, block.href, block.src);
}

// delete a block
export async function deleteBlock(id: string) {

    await execWithTransaction(statementDeleteBlock, id);
}

// update a block with updated fields, block id should exist
export async function updateBlock(block: entity.Block) {

    await execWithTransaction(statementUpdateBlock, block.tag, block.html, block.position, block.src, block.href, block.id);
}

// get all blocks for a page
export async function getAllBlocks(pageId: string): Promise<entity.Block[]> {

    const blocks: entity.Block[] = [];

    await queryWithTransaction(statementSelectBlocks, function scanRows(result: QueryResult<any>): Error | undefined {
        
        for (let i = 0; i < result.rows.length; ++i) {
            blocks.push(result.rows[i]);
        }
        return undefined;
    }, pageId);
    return blocks;
}
