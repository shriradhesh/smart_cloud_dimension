const mongoose = require('mongoose')
const engineer_Schema = new mongoose.Schema({
         name : {
                type : String
         },
         Engineer_id : {
               type : String
         },
         email : {
             type : String
         },
         password : {
              type : String
         },
         phone_no : {
             type : Number
             
         },
         profileImage : {
             type : String
         },
         status : {
                type : Number,
                enum : [0,1,2],
                default : 1
         },

         rating : {
               type : Number,
               default : 5
               
         }

       
}, { timestamps : true } )

const engineer_model = mongoose.model('engineer', engineer_Schema)

module.exports = engineer_model