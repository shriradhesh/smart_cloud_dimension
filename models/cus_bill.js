const mongoose = require('mongoose')
const cus_bill_schema = new mongoose.Schema({
       
         bill_no : {
                 type : String
         },
         Enq_no : {
            type : String
         },

         cus_Id : {
               type : String
         },
         cus_name  : {
                type : String
         },        

         services : [{

                service_id : {
                    type : mongoose.Schema.Types.ObjectId,
                    ref : 'services_model'
                },
                 service_name : {

                    type : String                    
                },
                service_price : {
                       type : Number
                }
         }],

         
         total_bill_amount : {
              type : Number
         },

         bill_status : {
            type : String,
            enum : ['Paid' , 'Pending' , 'Overdue'],
            defalt : 'Pending'
        },
        
        bill_pdf : {
              type : String
       }
      

}, {timestamps : true })

const cus_bill_Model = mongoose.model('cus_bill', cus_bill_schema)


module.exports = cus_bill_Model



