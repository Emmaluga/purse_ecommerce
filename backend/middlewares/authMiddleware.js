
const jwt = require('jsonwebtoken')
const authModel = require('../models/authModels')
const asyncHandler = require("express-async-handler")




const authUser = asyncHandler ( async (req, res, next )=> {

    let token 

 if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
      
             
                  try {
                    
        token = req.headers.authorization.split(" ")[1]
        const decoded = jwt.verify( token, process.env.JWTTOKEN )
        req.userObj = await authModel.findById(decoded.id).select("-password")
       
                    next()


                  } catch (error) {
                 res.status(500)
              throw new Error('wrong token, no access!')
                    
                  }  
                  
                  if(!token){
                    res.status(500)
                    throw new Error('wrong token ')

                  }


     }else{
        res.status(500)
        throw new Error('no token failed completly')
     }
     
    
     

    // ........................

    // const {token} = req.cookies


    // try {
    //     const decode = jwt.verify( token, process.env.JWTTOKEN )
    //     req.userObj = await authModel.findById(decode.id)

    //     next()

    // } catch (error) {

    //     if(!token){

    //         res.status(500)
    //         throw new Error("not authorized")
    
    //     }

        
        
    // }


  

        
    

})

 const authAdmin = asyncHandler ( async (req, res, next )=> {

      if( req.userObj.role === "user" ){

          res.status(500)
      throw new Error('you must be an admin to access ')

      }

    next()



 })





module.exports =  {
    
    authUser,
    authAdmin
    

}