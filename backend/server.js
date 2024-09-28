require('dotenv').config()
const express = require('express')
const connctDB = require('./configs/connectDb')
const authRoute = require('./routes/authRoute')
const errHandller = require('./middlewares/errorHandler')
const cors = require('cors')
const cookieparser = require('cookie-parser')
const notFound = require('./middlewares/notFound')



const app = express()




//routes

app.use(express.json())
app.use(express.urlencoded( {extended: true }) )
app.use(cookieparser())
app.use(cors({credentials: true, origin: true} ))




//routes
 app.use( authRoute )

  
 //customize middleware
 app.use(notFound)
app.use(errHandller)


  
const port = process.env.port || 5000


const start =  ()=> {

   try {
    

    connctDB( process.env.mongodburl )
    console.log('Connected to DB')

   } catch (error) {

    console.log('Failed to connect to DB')
    
   }
}


app.listen(port, ()=> console.log(`running on port ${port}`))


 start()



   
