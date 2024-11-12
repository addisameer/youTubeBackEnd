import dotenv from "dotenv"
dotenv.config()

import express from "express"
const app = express()

//creating routes
app.get('/' , (req,res) => {
    res.send("Home Page")
})

//creating server
const port = process.env.PORT || 5000
app.listen(port , () => {
    console.log(`Server is listening on the port ${port} `);
})