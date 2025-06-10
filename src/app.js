const express = require('express');

const app = express()//calling express function(creating new express js appliaction)-> creating web server

app.use("/hello",(req, res)=>{
    res.send("hello hello hello")
})

app.use("/test",(req, res)=>{
    res.send("Hello from server")
})

app.listen(3000, ()=>{
    console.log("server is successfully running on port 3000...");//this will printed when server started succesfully
})// if run,will wait to listen on port 3000
