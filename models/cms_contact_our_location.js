const mongoose = require('mongoose')

const cms_contact_our_location_Schema = new mongoose.Schema({
            Heading : {
                  type : String
            },
            Description : {
                   type : String
            },
          
}, { timestamps : true })

const cms_contact_our_location_Model = mongoose.model('cms_contact_our_location', cms_contact_our_location_Schema)

module.exports = cms_contact_our_location_Model
