import dotenv from "dotenv"
dotenv.config()
import { connectDb } from "./db/index.js"
import { app } from "./app.js"


//creating routes
app.get('/' , (req,res) => {
    console.log("Home Page");
    res.send("Home Page")
})
app.get('/about' , (req,res) => {
    console.log("About Page");
    res.send("About Page")
})

//Db connection
const port = process.env.PORT
connectDb()
.then(() => {
app.listen(port , () => {
    console.log(`Server is listening on the port ${port} `);
})

})
.catch((err) => {
    console.error("Db connection failed while calling" , err)
})
