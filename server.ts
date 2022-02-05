// load and inject environment variables before anything
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { setupDatabase } from './database';
import { setupCache } from './cache';

setupDatabase(process.env.DATABASE_URL || '');
setupCache(process.env.REDIS_URL || '', process.env.REDIS_USER || '', process.env.REDIS_PWD || '');

const app: express.Application = express();

// Serve the React App
app.use(express.static('web/build')); 
app.listen(process.env.PORT, () => console.log("Server is up!"));
