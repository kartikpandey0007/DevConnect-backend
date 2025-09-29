const express = require('express');
const connectDB = require("./config/database")
const app = express()//calling express function(creating new express js appliaction)-> creating web server(express application)
const cookieParser = require("cookie-parser")
const cors = require("cors")
const http = require("http")

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
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chats")

const initializeSocket = require('./utils/socket');

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)
app.use("/", chatRouter)

const server = http.createServer(app)//creating server using http.createServer(app) and app was our "const app = express()" express application
initializeSocket(server)

connectDB()
.then(()=>{
    console.log("Database connected")
    server.listen(process.env.PORT, ()=>{
    console.log("server is successfully running on port 3000...");//this will printed when server started succesfully
    })
})
.catch((err)=>{
    console.error("Cannot connect" ,err)
})




