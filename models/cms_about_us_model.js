const mongoose = require('mongoose')
const cms_about_us_Schema = new mongoose.Schema({
        
         Heading_1 : {
                type : String
         },
         Description_1 : {
             type : String
         },
         image_1 : {
                type : String
         },
         image_2 : {
               type : String
         },
         Heading_2 : {
            type : String
         },
        Description_2 : {
            type : String
        },
        image_3 : {
                type : String
        },
        
        Heading_3 : {
            type : String
         },
        Description_3 : {
            type : String
        },

        
        Heading_4 : {
            type : String
     },
     Description_4 : {
         type : String
     },
    
     Heading_5 : {
          type : String
     },
     Description_5 : {
           type : String
     }
} , { timestamps : true })

const cms_about_us_Model = mongoose.model('cms_about_us', cms_about_us_Schema)

module.exports = cms_about_us_Model