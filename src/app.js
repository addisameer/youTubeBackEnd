import dotenv from "dotenv"
dotenv.config()
import express from "express"
const app = express()
import cookieParser from "cookie-parser" 
import cors from "cors"


//middlewares configuration
app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended:true , limit : "16kb"}))
app.use(express.static("public"))
app.use(cookieParser)
app.use(cors({
    origin : process.env.CORS_ORIGIN
    
}))




export {app}






















