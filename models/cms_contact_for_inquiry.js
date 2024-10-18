const mongoose = require('mongoose')

const cms_contact_for_inquiry_Schema = new mongoose.Schema({
            Heading : {
                  type : String
            },
            Description : {
                   type : String
            },
          
}, { timestamps : true })

const cms_contact_for_inquiry_Model = mongoose.model('smart_contact_for_inquiry', cms_contact_for_inquiry_Schema)

module.exports = cms_contact_for_inquiry_Model
