const mongoose = require('mongoose')

const cms_home_service_smart_Access_system_Schema = new mongoose.Schema({
            Heading : {
                  type : String
            },
            Description : {
                   type : String
            },
            image : {
                   type : String
            }
}, { timestamps : true })

const cms_home_service_smart_Access_system_Model = mongoose.model('smart_Access_system', cms_home_service_smart_Access_system_Schema)

module.exports = cms_home_service_smart_Access_system_Model
