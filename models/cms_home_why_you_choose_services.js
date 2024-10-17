const mongoose = require('mongoose')

const cms_home_why_you_choose_services_schema = new mongoose.Schema({
            Heading : {
                  type : String
            },
            Description : {
                   type : String
            },
}, { timestamps : true })

const cms_home_why_you_choose_services_Model = mongoose.model('why_choose_services', cms_home_why_you_choose_services_schema)

module.exports = cms_home_why_you_choose_services_Model
