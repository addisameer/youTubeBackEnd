import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
import  { DB_NAME } from "../constants.js"


export const connectDb = async() => {
    try{
        const conn = await  mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        if(conn){
            console.log(`Db connected successfully , HOST : ${conn.connection.host} | PORT : ${conn.connection.port}`);
        }
    }catch(err){
        console.error("Db connection failed", err)
    }
}