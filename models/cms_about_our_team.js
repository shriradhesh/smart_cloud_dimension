const mongoose = require('mongoose')
const cms_about_us_our_team_schema = new mongoose.Schema({
       
          name : {
                type : String
          },
          designation : {
                type : String
          },
          profile_image : {
                type : String
          }
}, { timestamps : true })

const cms_about_us_our_team_model = mongoose.model('cms_about_us_our_team', cms_about_us_our_team_schema)

module.exports = cms_about_us_our_team_model