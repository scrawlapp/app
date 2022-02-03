// load and inject environment variables before anything
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { QueryResult } from 'pg';
import { setupDatabase, queryWithTransaction } from './database';
import { setupCache, getClient } from './cache';

const app: express.Application = express();

app.get('/', async (req: express.Request, res: express.Response) => {

    try {

        let message = '';
        message += '<p>This is the scrawl server.<p>';

        await queryWithTransaction('SELECT NOW()', (rows: QueryResult<any>): Error | undefined => {

            console.log(rows);
            return undefined;
        });

        message += '<p>I can talk to the database server.</p>';

        const client = getClient();
        if (!client.isOpen) {
            await client.connect();
        }
        await client.set('key', 'value');
        message += '<p>I can talk to the cache server.</p>';

        res.contentType('html');
        res.send(message);
    } catch (err) {

        console.log(err);
        res.send('oops! check logs.');
    }
});

setupDatabase(process.env.DATABASE_URL || '');
setupCache(process.env.REDIS_URL || '', process.env.REDIS_USER || '', process.env.REDIS_PWD || '');
app.listen(process.env.PORT, () => console.log("Server is up!"));
