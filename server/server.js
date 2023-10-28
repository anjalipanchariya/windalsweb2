import bodyParser from "body-parser"
import express from "express"
import cors from 'cors'
import db from "./Database/connection.js";
import router from "./Router/router.js";
import dotenv from 'dotenv'
import path from 'path'
import {fileURLToPath} from 'url';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const PORT =  process.env.PORT || 3000;

db.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Database connected');
        
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);
        });
    }

    // Release the connection back to the pool
    // connection.release();
});

app.get('/',(req,res)=>{
    res.status(200).send("connected")
})

app.use('/api',router)