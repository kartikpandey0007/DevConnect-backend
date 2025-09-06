const express = require('express');
const connectDB = require("./config/database")
const app = express()//calling express function(creating new express js appliaction)-> creating web server
const cookieParser = require("cookie-parser")
const cors = require("cors")
require('dotenv').config()

app.use(cors({
    origin: "http://localhost:5173",//frontend url
    credentials: true, //to allow cookies to be sent
}))




app.use(express.json())
app.use(cookieParser())

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const userRouter = require("./routes/user")

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)



connectDB()
.then(()=>{
    console.log("Database connected")
    app.listen(process.env.PORT, ()=>{
    console.log("server is successfully running on port 3000...");//this will printed when server started succesfully
    })
})
.catch((err)=>{
    console.error("Cannot connect" ,err)
})




