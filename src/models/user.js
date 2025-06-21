const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')



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


userSchema.methods.getJWT = async function () { //dont use arrow function
    const user = this;

    const token = await jwt.sign({_id: user._id}, "DEV@Tinder$790", {expiresIn:"7d"})

    return token;
}


userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    passwordHash = user.password

    const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHash)

    return isPasswordValid;
}



const User = mongoose.model('User', userSchema)
module.exports = User