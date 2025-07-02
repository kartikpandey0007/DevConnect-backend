const express = require('express');
const userRouter = express.Router();
const  userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/ConnectionRequest");


userRouter.get("/user/requests/received", userAuth, async (req,res)=>{

    try{
        const loggedInUser = req.user

        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName"])

        res.json({
            message:"Data Fetched Successfully",
            data : connectionRequest,
        }) 
    }
    catch(err){
        req.status(400).send("ERROR: " + err.message);
    }

})


userRouter.get("/user/connections", userAuth, async (req,res)=>{

    try{
        const loggedInUser = req.user

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id,status: "accepted"},
                {fromUserId: loggedInUser._id,status: "accepted"},
            ]
        }).populate("fromUserId", ["firstName", "lastName"])

        res.json({
            data : connectionRequest,
        }) 
    }
    catch(err){
        req.status(400).send("ERROR: " + err.message);
    }
    
})





module.exports = userRouter;