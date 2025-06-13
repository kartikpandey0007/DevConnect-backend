const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    emailID: {
        type: String,
        required: true, 
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
    },
    gender: {
        type : String,
    },
    photoUrl: {
        type: String,
    },
    about: {
        type: String,
        default: "This is a default about of user",
    },
    skills: {
        type: [String],
        
    }, 
},{timestamps: true,})

const User = mongoose.model('User', userSchema)
module.exports = User