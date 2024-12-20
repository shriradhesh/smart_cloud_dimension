const mongoose = require('mongoose')
const service_Schema = new mongoose.Schema({
         service_name : {
               type : String
         },
         service_price : {
               type : Number
         },
         service_description : {
              type : String
         },
         status : {
               type : Number,
               enum : [ 1 , 0 ],
               default : 1
         },
         service_icon : {
                  type : String
         }
}, { timestamps : true })

const services_model = mongoose.model('service' , service_Schema)

module.exports = services_model