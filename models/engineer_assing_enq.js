const mongoose = require('mongoose')
const engineer_assign_enq_Schema = new mongoose.Schema({
         customer_id : {
               type : String
         },
         engineer_id : {
               type : String
         },
         engineer_name : {
              type : String
         },
         Enq_no : {
               type : String
         },
         status : {
               type : Number ,
               enum : [1 , 0],
               default : 1
         },

         Bill : [{
            bill_id : {
                  type : mongoose.Schema.Types.ObjectId,
                  ref : 'cus_bill_Model'
            } ,
            bill_no : {
                     type : String
            },
            services : [{
                      service_name : {
                           type : String
                      },
                      service_price : {
                           type : Number
                      },
                      service_id : {
                            type : mongoose.Schema.Types.ObjectId,
                            ref : 'services_model'
                      }
            }],

            bill_status : {
                      type : String
            },
            total_Bill : {
                      type : Number
            }


         }]
}, { timestamps : true })

const enginner_assign_enq_model = mongoose.model('enginner_assign_enq', engineer_assign_enq_Schema)

module.exports = enginner_assign_enq_model