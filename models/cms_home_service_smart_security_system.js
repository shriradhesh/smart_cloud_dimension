const mongoose = require('mongoose')

const cms_home_service_Smart_Security_Systems_Schema = new mongoose.Schema({
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

const cms_home_service_smart_security_system_Model = mongoose.model('smart_security_system', cms_home_service_Smart_Security_Systems_Schema)

module.exports = cms_home_service_smart_security_system_Model
