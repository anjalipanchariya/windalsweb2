import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
import path from 'path'
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });
const JWT_SECRET = process.env.JWT_SECRET;

async function auth(req,res,next){
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(" ")[1]
        if(token === null || token===undefined){
            return res.status(401).send({msg:"Authentication Failed",redirectUrl:"http://localhost:3000"})
        }
        const decodedToken = await jwt.verify(token,JWT_SECRET)
        
        const newBody = {
            ...req.body,
            token:decodedToken
        }
        req.body = newBody
        // console.log({token:token,decodedToken:decodedToken,user:req.body});
        // res.json(decodedToken)
        next()
    } catch (error) {
        console.log("Database error:", error)
        return res.status(404).send({msg:`Authentication Error: ${error}`,redirectUrl:"http://localhost:3000"})
    }
}

export {auth}