
const bcryptjs = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const authModel = require("../models/authModels")
const { tokenFunc } = require('../utilities/tokenUtility')
const { sendMailFunction } = require('../utilities/nodemailfunc')
const crypto = require('crypto')
  


//auth logic

const signUpContrl = asyncHandler (   async  (req, res )=>  {

 const {firstName,lastName,email,password, userName, role } = req.body

   const existUser = await authModel.findOne({email})

   if(existUser){

        res.status(500)
        throw new Error('user already exist pls sign in ')

   }
     
     //create newUsers
     const NewUsers = await authModel.create({
       
        firstName,
        lastName,
        email,
        password,
        userName: Math.random().toString(),
        role

     })

       if(NewUsers){

         res.status(200).json({
            id: NewUsers._id,
            firstName: NewUsers.firstName,
            lastName: NewUsers.lastName,
            userName: NewUsers.userName,
            role: NewUsers.role  

         })

       }else{
         res.status(500)
         throw new Error('invalid credentials')
       }
   
})


const signInContrl = asyncHandler ( async (req, res )=> {

   const {email, password } = req.body

   //validate email and password

const users = await authModel.findOne({email})

   //check user validate

 if(users && (await bcryptjs.compare( password, users.password ))){
      
    const storeToken = await tokenFunc(users._id)
    res.cookie("token", storeToken, {
       maxAge: 60 * 60 * 1000,
        httpOnly: true, 
        secure: true})
     
         res.json({

            firstName: users.firstName,
            token: storeToken
         })

  
      }else{
         res.status(500)
         throw new Error('email or password does not match')
      }
     
})


  const userProfile = asyncHandler ( async (req, res)=> {
    
      const { _id, firstName } = await authModel.findById( req.userObj.id)

      res.status(200)
      .json({

         id: _id,
         firstName,
         message: "welcome to your dashboard"
      })
  })

  const fgtpassCtrl =  asyncHandler ( async (req,res)=> {
   const {email} = req.body
   const user = await authModel.findOne({email})
   if(!user){
    res.status(500)
    throw new Error('info does not exist pls register')
   }

   const genToken = await user.genFgtpassToken()
   await user.save()

   const url = `http://localhost:3000/forgotpassword/${genToken}` 

   const message = 

   `
   <2>You requested a password reset</2>
   <p>Please click the link below to reset your password</p>
  <a href=${url} clicktracking=off>${url}</a>
    <p>Please ignore this message if you did not request a reset password</p>
 
     `
   
     const sendingMail = await sendMailFunction({

        to: user.email,
        subject: 'Password Reset',
        html: message
     })
   
     res.status(200)
     res.json({message: 'email sent'})
     
     
     if(!sendingMail){
      user.resetPasswordToken = undefined
      user.resetPasswordTokenExpires = undefined
      await user.save()
      res.status(400)
      throw new Error('email not sent ')

     }
   
  })


  const resetPassCtrl =  asyncHandler ( async (req,res)=> {
     const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex')
     const user = await authModel.findOne({

       resetPasswordToken,
       resetPasswordTokenExpires: { $gt: Date.now() }
       
     })

     if(!user){
       res.status(500)
       throw new Error('invalid token')
     }
     //new password
       user.password = req.body.password
       user.resetPasswordToken = undefined,
       user.resetPasswordTokenExpires = undefined,
       await user.save()

       res.status(201)
       res.json({message: 'password reset'})


  })

  const logOut = asyncHandler ( async (req,res)=> {

      res.clearCookie("token")
      res.status(200)
      .json({
        message: 'successfully logged out'
      })
  })
  

    





module.exports = {

        signUpContrl,
        signInContrl,
        userProfile,
        fgtpassCtrl,
        resetPassCtrl,
        logOut
        
}