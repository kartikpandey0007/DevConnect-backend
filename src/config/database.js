const mongoose = require('mongoose')

const connectDB = async ()=> {
   await mongoose.connect("mongodb+srv://namastedev:Ecci%401234@cluster0.lah0jcq.mongodb.net/devTinder")
}

module.exports = connectDB