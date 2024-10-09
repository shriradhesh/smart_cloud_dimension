
const mongoose = require('mongoose')
const adminSchema = new mongoose.Schema({

         full_name : {
              type : String
         },
         email : {
              type : String
         },
         password : { 
               type : String
         },
         Profile_image : {
               type : String
         },
         status : {
             type : Number,
             enum : [ 1 , 0],
             default : 1
         }
} , { timestamps : true })

const adminModel = mongoose.model('admin', adminSchema)
module.exports = adminModel