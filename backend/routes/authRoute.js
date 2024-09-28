const express = require('express')
const  {signUpContrl, signInContrl, userProfile , 
  fgtpassCtrl, resetPassCtrl,  logOut } = require('../controllers/authController')
const { authUser, authAdmin } = require('../middlewares/authMiddleware')
const {  errorsValidation, checkingSignUp, checkingLogin } = require('../middlewares/validate')
const authRoute = express.Router()



authRoute.post("/register", checkingSignUp, errorsValidation,  signUpContrl )
authRoute.post('/login', checkingLogin, errorsValidation , signInContrl  )
authRoute.get('/userProfile', authUser, authAdmin, userProfile )
authRoute.post('/forgotpassword', fgtpassCtrl )
authRoute.put('/resetpassword/:resettoken',  resetPassCtrl )
authRoute.get('/logout',  logOut )






module.exports = authRoute   