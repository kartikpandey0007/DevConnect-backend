const express = require('express');
const profileRouter = express.Router();

const userAuth = require("../middlewares/auth")
const {validateSignUpData,validateEditProfileData} =require("../utils/validation")

profileRouter.get("/profile/view", userAuth, async (req,res)=>{
    try{
        const user = req.user
        
        res.send(user)
    }
    catch(err){
        res.status(400).send("something went glat!!" + err.message)
    }
})


profileRouter.patch("/profile/edit", userAuth, async (req,res)=>{
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid edit REquest!!")
        }
        else{
           const user =  req.user;
           Object.keys(req.body).forEach((key)=> (user[key] = req.body[key]))

          await user.save()

           res.send("updated sucessfully")
        }
    }
    catch(err){
        res.status(400).send("something went glat!!" + err.message)
    }
})


module.exports = profileRouter