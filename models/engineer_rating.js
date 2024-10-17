const mongoose = require('mongoose')
const Engineer_rating_schema = new mongoose.Schema({
        
           engineer_id : {
                type : String
           },
           customer_id : {
                type : String
           },
           rating : {
                type : Number
           }

}, { timestamps : true })

const engineer_rating_model = mongoose.model('Engineer_rating', Engineer_rating_schema)

module.exports = engineer_rating_model