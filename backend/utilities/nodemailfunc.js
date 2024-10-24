const nodemailer = require('nodemailer')


const sendMailFunction = async (options) => {

   const transporter = nodemailer.createTransport({

       services: process.env.EMAIL_SERVICES,

       auth: {
        user:  process.env.USER_EMAIL,
        password: process.env.USER_PASSWORD 
       }
   })

   const mailOptions = {
     from: process.env.SENDER_MAIL,
     to: options.to,
     subject: options.subject,
     html: options.html
   }

   transporter.sendMail(mailOptions, function(err, info){
  
      if(err){
        console.log('not sending')

      }
      if(info){
        res.status(201)
      console.log('sending ....')

      }

   })
}


module.exports =  { sendMailFunction }