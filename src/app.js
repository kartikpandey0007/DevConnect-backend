const express = require('express');
const connectDB = require("./config/database")
const app = express()//calling express function(creating new express js appliaction)-> creating web server
const User = require("./models/user")
const {validateSignUpData} =require("./utils/validation")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const userAuth = require("./middlewares/auth")

app.use(express.json())
app.use(cookieParser())


app.post("/signup", async (req, res) => {
    try {
        //validation of data
        validateSignUpData(req)

        //encrypt password
        const { firstName, lastName, emailID, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10)


        //update password in request body
        const user = new User({firstName,
            lastName,
            emailID, 
            password: passwordHash,
        });

        await user.save();
        res.send("User added successfully");
    } 
    catch (err) {
        res.status(400).send("Error aaya: " + err.message);
    }
})


app.post("/login", async (req,res) =>{
    try{
        const {emailID, password} = req.body

        const user =  await User.findOne({emailID: emailID})

        if(!user){
            throw new Error("Email not valid")
        }

        const isPasswordValid = await user.validatePassword(password)

        if(isPasswordValid){
            //create a jwt token 
            const token = await user.getJWT()

            //add the token to cookie and send the response back to the user
            res.cookie("token",token);
            res.send("login successful")
        }
        else{
            throw new Error("incorrect password")
        }
    } catch(err){
        res.status(400).send("something went glat!!" + err.message)
    }
})


app.get("/profile", userAuth, async (req,res)=>{
    try{
        const user = req.user
       
        res.send(user)
    }
    catch(err){
        res.status(400).send("something went glat!!" + err.message)
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




