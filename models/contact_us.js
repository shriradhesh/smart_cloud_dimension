const mongoose = require('mongoose')
const contact_us_schema = new mongoose.Schema({
      
           first_name : {
                type : String
           } ,
           last_name : {
               type : String
           },
           email : {
               type : String
           },
           phone_no : {
               type : Number
           },
           subject : {
               type : String
           },
           message : {
               type : String
           },

}, {timestamps : true })

const contact_us_Model = mongoose.model('contact_us', contact_us_schema)

module.exports = contact_us_Model
