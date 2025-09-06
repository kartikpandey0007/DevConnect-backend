const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')



const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50, 
    },
    lastName: {
        type: String,
    },
    emailID: {
        type: String,
        lowercase: true,
        required: true, 
        unique: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid email")
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
        enum: {
            values: ["male","female","others",""],
            message: `{VALUE} is not a valid gender type`
        }
    },
    photoUrl: {
        type: String,
        default: "https://www.w3schools.com/howto/img_avatar.png",

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

    const token = await jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn:"7d"})

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