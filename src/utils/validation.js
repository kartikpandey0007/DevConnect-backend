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



module.exports = {
    validateSignUpData,
}
