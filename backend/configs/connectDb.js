require('dotenv').config()
const mongoose = require('mongoose')



const connctDB = async (url)=> {

   await mongoose.connect(url)
}


mongoose.set('strictQuery', false)

module.exports =  connctDB