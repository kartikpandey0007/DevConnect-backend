const express = require('express');
const userRouter = express.Router();
const  userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require('../models/user');

const USER_SAFE_DATA = "firstName lastName age gender photoUrl about skills"


userRouter.get("/user/requests/received", userAuth, async (req,res)=>{

    try{
        const loggedInUser = req.user

        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA)

        res.json({
            data : connectionRequest,
        }) 
    }
    catch(err){
        res.status(400).send("ERROR: " + err.message);
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
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA)

        const data = connectionRequest.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId
            }
            else{
                return row.fromUserId
            }
        })

        res.json({
            data : data,
        }) 
    }
    catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
    
})


userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit

        const skip = (page-1) * limit

        //finding all connection request (send + received)[jha bhi loggedin user involve h dont fetch that users]
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        })
        .select("fromUserId toUserId")
        

        const hideUserFromFeed = new Set();
        connectionRequest.forEach((req)=>{
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        })
        
        const user = await User.find({
            $and: [
               { _id: {$nin: Array.from(hideUserFromFeed)} },
               { _id : {$ne: loggedInUser._id} }
            ]
        }).select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit)

        res.json({
            data: user
        });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});





module.exports = userRouter;