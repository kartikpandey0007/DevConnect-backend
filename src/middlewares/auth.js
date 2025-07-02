const jwt = require("jsonwebtoken")
const User = require("../models/user")

const userAuth = async (req,res,next)=>{
    try{
    const cookies = req.cookies;

    const {token}= cookies;
    if(!token){
        throw new Error("Token is not valid!!!!!")
    }

    const decodeObj = await jwt.verify(token,"DEV@Tinder$790")
    
    const{_id}=decodeObj

    const user = await User.findById(_id)
    if(!user){
        throw new Error("User not exist")
    }

    req.user = user; //attached user to req.user
    next();
    }
    catch(err){
        res.status(400).send("ERROR: " + err.message)
    }
    
}



module.exports = userAuth;



