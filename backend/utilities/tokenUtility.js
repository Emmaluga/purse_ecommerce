
const jwt = require('jsonwebtoken')

exports.tokenFunc = async (id)=> {
 return jwt.sign({id},process.env.JWTTOKEN, {expiresIn: 60*60*1000})
    
}