const mongoose = require('mongoose')
 const cms_contact_us_details = new mongoose.Schema({
                

          Heading : {
                  type : String
          },
          Description : {
                type : String
          },
          mail_at : {
               type : String
          },
          mail : {
              type : String
          },
          call_us_on : {
              type : String
          },
          call : {
               type : String
          },
          our_address : { 
               type : String
          },
          address : {
                type : String
          },
          time_schedule : {
               type : String
          },
          time : {
               type : String
          }

 } , { timestamps : true })

 const cms_contact_us_details_model = mongoose.model('cms_contact_us_detail', cms_contact_us_details)

 module.exports = cms_contact_us_details_model

 