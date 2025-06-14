const express = require('express');
const connectDB = require("./config/database")
const app = express()//calling express function(creating new express js appliaction)-> creating web server
const User = require("./models/user")
const {validateSignUpData} =require("./utils/validation")
const bcrypt = require("bcrypt")

app.use(express.json())


app.post("/signup", async (req, res) => {
    try {
        //validation of data
        validateSignUpData(req)

        //encrypt password
        const { firstName, lastName, emailID, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10)


        //update password in request body
        const user = new User({firstName,
            lastName,
            emailID, 
            password: passwordHash,
        });

        await user.save();
        res.send("User added successfully");
    } 
    catch (err) {
        res.status(400).send("Error aaya: " + err.message);
    }
})

app.post("/login", async (req,res) =>{
    try{
        const {emailID, password} = req.body

        const user =  await User.findOne({emailID: emailID})

        if(!user){
            throw new Error("Email not valid")
        }

        const isPasswordValid = await bcrypt.compare(password,user.password)
        if(isPasswordValid){
            res.send("login successful")
        }
        else{
            throw new Error("incorrect password")
        }
    }
    catch(err){
        res.status(400).send("something went glat!!" + err.message)
    }
})


app.get("/user", async (req,res)=>{
    const userlastName = req.body.lastName

    try{
        const users = await User.find({lastName:userlastName})
        if(users.length === 0){
            res.status(404).send("user not found") 
        } 
        else{
            res.send(users)
        }
       
    }
    catch(err){
        res.status(400).send("something went glat!!")
    }
})


app.get("/feed", async (req,res)=>{
    try{
        const users = await User.find({});
        res.send(users)
    }
    catch(err){
        res.status(400).send("something went glat!!")
    }
})


app.delete("/user", async (req, res)=>{
    const userId = req.body.userId;

    try{
        //await User.findByIdAndDelete({_id: userId})
        const user = await User.findByIdAndDelete(userId)

        res.send("user deleted successfully")
    }catch(err){
        res.status(400).send("something went glat!!")
    }

})


app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["firstName", "lastName",
        "password"];

    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });

    res.send("User updated!!");
  } catch (err) {
    console.error(err); // for debug
    res.status(400).send("Something went wrong!!");
  }
});



connectDB()
.then(()=>{
    console.log("Database connected")
    app.listen(3000, ()=>{
    console.log("server is successfully running on port 3000...");//this will printed when server started succesfully
    })
})
.catch((err)=>{
    console.error("Cannot connect")
})




