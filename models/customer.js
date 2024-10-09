const mongoose = require('mongoose')
const customer_Schema = new mongoose.Schema({
        name : {
               type : String
        },
        email : {
               type : String
        },
        phone_no : {
               type : String
        },
        
        profileImage : {
               type : String
        },
        customer_id : {
               type : String
        },
        address : {
                 type : String
        },
        status : {
               type : Number,
               enum : [ 1 , 0 ],
               default : 1
        }
}, { timestamps : true })

 const customer_Model = mongoose.model('customer' , customer_Schema)

 module.exports = customer_Model