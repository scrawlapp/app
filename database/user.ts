import * as entity from '../entity/';
import { v4 as uuidv4 } from 'uuid';
import { QueryResult } from 'pg';
import { execWithTransaction, queryWithTransaction } from '.';

const statementInsertUser = `insert into users (id, "firstName", "lastName", email, password) values ($1, $2, $3, $4, $5);`
const statementSelectUserFromEmail = "select * from users where email = $1;"
const statementDeleteUser = "delete from users where id = $1;"
const statementUpdateFirstName = `update users set "firstName" = $1 where id = $2`;
const statementUpdateLastName = `update users set "lastName" = $1 where id = $2`;
const statementUpdatePassword = `update users set password = $1 where id = $2`;

// take a user and insert it into the database.
// uuid will be created and assigned before inserting.
export async function insertUser(user: entity.User) {

    user.id = uuidv4();
    await execWithTransaction(statementInsertUser, user.id, user.firstName, user.lastName, user.email, user.password);
}

// get the first matching user from database based on email.
// if none exists, all fields are empty strings.
export async function getUser(email: string): Promise<entity.User> {

    let user: entity.User = {
        id: '', email: '', password: '', firstName: '', lastName: ''
    };
    await queryWithTransaction(statementSelectUserFromEmail, 
        function scanRows(result: QueryResult<any>): Error | undefined {
            
            user = result.rows[0];
            return undefined;             
    }, email);

    return user;
}

// delete a user based on id.
export async function deleteUser(id: string) {

    await execWithTransaction(statementDeleteUser, id);
}

// no magic, does what the name says
export async function updateFirstName(id: string, firstName: string) {
    
    await execWithTransaction(statementUpdateFirstName, firstName, id);
}

// no magic, does what the name says
export async function updateLastName(id: string, lastName: string) {
    
    await execWithTransaction(statementUpdateLastName, lastName, id);
}

// no magic, does what the name says
export async function updatePassword(id: string, password: string) {
    
    await execWithTransaction(statementUpdatePassword, password, id);
}

