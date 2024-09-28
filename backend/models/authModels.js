const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const mongoose = require('mongoose')


const authModel = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,
        trim: true
    },

    lastName: {
        type: String,
        required: true,
        trim: true
    },

    userName: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true

    },

    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowerCase: true
    },

    password: {
        type: String,
        required: true,
        trim: true
    },
    resetPasswordToken: String,
    resetPasswordTokenExpires: Date,


    role: {
        type: String,
        enum:['user', 'admin'],
        default: 'user',
        index: true
    },
    

    contactNumber: {
        type: String
    },


    profilePicture: {
        type: String
    }

},
  {timestamps: true}

)

     
 // HASH PASSWORD BEFORE SAVING

authModel.pre('save', async function(next){
    
    if(!this.isModified('password')){
        next()

    }else{

      return this.password = await bcryptjs.hash(this.password, 10)
    }
})


authModel.methods.genFgtpassToken = async function(){
    const token = crypto.randomBytes(20).toString('hex')

resetPasswordToken = await crypto.createHash('sha256').update(token).digest('hex'),
resetPasswordTokenExpires = Date.now() + 10 * (10 * 1000 ) 

    return token

}


module.exports = mongoose.model('Users', authModel)








  


   
    
 