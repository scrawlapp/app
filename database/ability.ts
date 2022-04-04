import * as entity from '../entity/';
import { QueryResult } from 'pg';
import { execWithTransaction, queryWithTransaction } from '.';

export interface SharedPage {

    id: string,
    name: string,
    ability: string
}

const statementInsertAbility = `insert into abilities ("pageId", "userId", ability) values ($1, $2, $3)`;
const statementDeleteAbility = `delete from abilities where "pageId" = $1 and "userId" = $2;`;
const statementSelectSharedPages = `select pages.id, pages.name, abilities.ability from pages, abilities where abilities."pageId" = pages.id and abilities."userId" = $1;`;

// insert an ability
export async function insertAbility(ability: entity.Ability) {

    await execWithTransaction(statementInsertAbility, ability.pageId, ability.userId, ability.ability);
}

// get all shared pages
export async function getAllSharedPages(userId: string) {
    
    const pages: SharedPage[] = [];
    await queryWithTransaction(statementSelectSharedPages, function scanRows(result: QueryResult<any>): Error | undefined {
            
        for (let i = 0; i < result.rows.length; ++i) {
            pages.push(result.rows[i]);
        }
        return undefined;
    }, userId);

    return pages;
}

// delete an ability
export async function deleteAbility(pageId: string, userId: string) {

    await execWithTransaction(statementDeleteAbility, pageId, userId);
}


