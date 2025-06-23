const express = require('express');
const authRouter = express.Router();

const {validateSignUpData} =require("../utils/validation")
const User = require("../models/user")
const bcrypt = require("bcrypt")


authRouter.post("/signup", async (req, res) => {
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


authRouter.post("/login", async (req,res) =>{
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


authRouter.post("/logout", async (req,res) =>{
    try{
        res.cookie("token",null, {expires: new Date(Date.now())});
        res.send("logout successfully")
    } 
    catch(err){
        res.status(400).send("something went glat!!" + err.message)
    }
})



module.exports = authRouter