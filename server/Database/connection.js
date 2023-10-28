import mysql from 'mysql2'
import dotenv from 'dotenv'
import path from 'path'
import {fileURLToPath} from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const db = mysql.createPool({
    connectionLimit: 10,
    user: process.env.DATABASE_USER,
    host: process.env.HOST,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
})

export default db;

