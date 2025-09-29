const mongoose = require('mongoose')

const messageShema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },
    text: {
        type: String,
        required: true,
    }
},{timestamps: true})

const chatSchema = new mongoose.Schema({
    participants: [
        {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
    ],
    messages: [messageShema],
})

const Chat = mongoose.model("Chat",chatSchema)

module.exports = {Chat}
