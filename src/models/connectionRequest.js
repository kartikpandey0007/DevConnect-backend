 const mongoose = require('mongoose')
 
 
 const connectionRequestSchema = new mongoose.Schema({

    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status:{
        type: String,
        enum: {
            values: ["ignored","interested","accepted","rejected"],
            message: `{VALUE} is incorrect status type`
        },
        required: true,
    }
 },{timestamps: true,})


connectionRequestSchema.pre("save",function(next){
    const connectionRequest = this;
    //check if fromUserId and toUserId are same or not
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("cannot send conneection requuest to self, make new frnds instead")
    }
    next();
})

const connectionRequestModel = new mongoose.model('connectionRequestSchema', connectionRequestSchema)
module.exports = connectionRequestModel
 