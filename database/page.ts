import * as entity from '../entity/';
import { v4 as uuidv4 } from 'uuid';
import { QueryResult } from 'pg';
import { execWithTransaction, queryWithTransaction } from '.';

const statementSelectPages = "select id, name from pages where owner = $1";
const statementInsertPage = "insert into pages (id, name, owner) values ($1, $2, $3);"
const statemenetUpdatePageName = "update pages set name = $1 where id = $2 and owner = $3;"
const statementDeletePage = "delete from pages where id = $1 and owner = $2;"

// insert a page
export async function insertPage(page: entity.Page) {

    page.id = uuidv4();
    await execWithTransaction(statementInsertPage, page.id, page.name, page.owner);
}

// delete a page
export async function deletePage(id: string, owner: string) {

    await execWithTransaction(statementDeletePage, id, owner);
}

// update page name
export async function updatePageName(page: entity.Page) {

    await execWithTransaction(statemenetUpdatePageName, page.name, page.id, page.owner);
}

// get pages of the user
export async function getPages(owner: string): Promise<entity.Page[]> {

    const pages: entity.Page[] = [];
    await queryWithTransaction(statementSelectPages, function scanRows(result: QueryResult<any>): Error | undefined {
            
        for (let i = 0; i < result.rows.length; ++i) {
            pages.push(result.rows[i]);
        }
        return undefined;
    }, owner);

    return pages;
}
