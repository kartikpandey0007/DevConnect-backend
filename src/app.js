const express = require('express');
const connectDB = require("./config/database")
const app = express()//calling express function(creating new express js appliaction)-> creating web server
const User = require("./models/user")

app.post("/signup", async (req,res)=>{

    const user = new User({
        firstName: "Kartik",
        lastName: "Pandey",
        emailId: "xyz@gamil.com",
        password: "Ecci@1234",
    });

    try{
        await user.save()
        res.send("user added successfully")
    } catch (err) {
        res.status(400).send("Error saving the user: " + err.message);
    }
})

 







connectDB()
.then(()=>{
    console.log("Database connected")
    app.listen(3000, ()=>{
    console.log("server is successfully running on port 3000...");//this will printed when server started succesfully
    })
})
.catch((err)=>{
    console.error("Cannot connect")
})




