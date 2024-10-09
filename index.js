const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 3400
const bodyParser = require('body-parser')
const cors = require('cors')

const adminRouter = require('./Routers/adminRouter')
const userRouter = require('./Routers/userRouters')


// Datbase configuration
require('./config/db')

// middleware configuration
app.use(express.json())
app.use(bodyParser.urlencoded({ extended : true }))
app.use(cors())
app.use(express.static('uploads'))



app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
    });
          

    app.get("/", ( req , res )=> {
        res.send(" Hello from the server ")
 })
 
app.use('/api', adminRouter)
app.use('/api', userRouter)

app.listen(port , ()=> {
          console.log(`Server is Running at PORT : ${port}`);
          
})
