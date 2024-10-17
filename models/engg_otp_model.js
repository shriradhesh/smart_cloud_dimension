const mongoose = require('mongoose')
const Engg_Otp = new mongoose.Schema({
     engineer_id : {
         type : String,
         
     },

       otp : {
         type : Number
       }
}, { timestamps : true })

const Engg_otp_Model = mongoose.model('Engg_OTP' , Engg_Otp)
module.exports = Engg_otp_Model