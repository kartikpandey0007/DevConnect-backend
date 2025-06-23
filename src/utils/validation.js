const validator = require('validator')


const validateSignUpData = (req)=>{
    const { firstName, lastName, emailID, password } = req.body

    if(!firstName || !lastName){
        throw new Error("Name invalid")
    }
    else if(!validator.isEmail(emailID)){
        throw new Error("Invalid Email")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("ENter strong pass")   
    }
}

const validateEditProfileData = (req)=>{
    const allowedEditFields = ["firstName","lastName","emailID","photoUrl","gender","age","about","skills"]

    const isEditAllowed = Object.keys(req.body).every(field=> allowedEditFields.includes(field))

    return isEditAllowed;
}

module.exports = {
    validateSignUpData,validateEditProfileData
}
