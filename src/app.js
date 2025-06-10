const express = require('express');

const app = express()//calling express function(creating new express js appliaction)-> creating web server

/*app.use("/",(req, res)=>{
    res.send("hello from kartik")
})*/

/*app.use("/hello/2",(req, res)=>{
    res.send("hello hello hello 2") 
}) */  


app.use("/user",(req, res)=>{
    res.send("hahahaha") 
}) 

//this will only haldle GET call to /user
app.get("/user", (req,res)=>{
    res.send({firstName: "Kartik", lastName: "Pandey"})
})

app.post("/user", (req,res)=>{
    //saving data to db
    res.send("Data successfully saved to db")
})

app.delete("/user", (req,res)=>{
    res.send("Deleted successfully")
})

//this will match all the HTTP methods API calls to /hello
app.use("/hello",(req, res)=>{  
    res.send("hello hello hello")
}) 

app.use("/test",(req, res)=>{
    res.send("Hello from server")
})

app.listen(3000, ()=>{
    console.log("server is successfully running on port 3000...");//this will printed when server started succesfully
})// if run,will wait to listen on port 3000
