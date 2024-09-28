const {check, validationResult} = require('express-validator')

exports.checkingSignUp = [

    check('firstName')
    .notEmpty()
    .withMessage('firstName is required'),

    check('lastName')
    .notEmpty()
    .withMessage('lastName is required'),

    check('email')
    .isEmail()
    .withMessage('email is required'),

    check('password')
    .isStrongPassword()
    .withMessage('password requires at least one uppercase,lowercase,a number,a symbol'),
],

exports.checkingLogin = [

    check('email')
    .isEmail()
    .withMessage('email is required'),

    check('password')
    .isStrongPassword()
    .withMessage('password requires at least one uppercase,lowercase,a number,a symbol'),
];

exports.errorsValidation = async (req,res,next)=>{
    const errors = validationResult(req)
    if(errors.array().length > 0 ){
       return res.status(400).json({error: errors})

    }
    next()

}