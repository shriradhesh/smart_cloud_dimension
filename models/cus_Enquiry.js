const mongoose = require('mongoose')
const cus_enq_schema = new mongoose.Schema({
        customer_id : {
               type : String
        },
        Enq_no : {
                type : String
        },

         services : [{
                                service_id : {
                                        type : mongoose.Schema.Types.ObjectId,
                                        ref : 'services_model',
                                  },
                
                                        service_name : {
                                                        type : String
                                        }, 
                                
                                        service_price : {
                                                type : Number
                                }, 
                   }],

               
        
       customer_name : {
               type : String,
       },
        customer_email : {
               type : String
        },
        customer_phone_no : {
                 type : String
        },
        subject : {
                 type : String
        },
        customer_address : {
                 type : String
        },
          message : {
               type : String
          },
          status : {
                type : String,
                enum : ['Pending' , 'Confirmed' , 'Assigned' , 'Cancelled'],
                default : 'Pending'
          },

          bill_pdf : {
                type : String
         }
}, { timestamps : true })

const cus_enq_Model = mongoose.model('Custmer_enquiry', cus_enq_schema)

module.exports = cus_enq_Model