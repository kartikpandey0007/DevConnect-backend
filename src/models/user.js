const mongoose = require('mongoose')
const validator = require('validator')

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
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid email" +" "+ value)
            }
        }
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