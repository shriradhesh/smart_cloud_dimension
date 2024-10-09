const mongoose = require('mongoose')
const adminOtp = new mongoose.Schema({
     adminId : {
         type : mongoose.Schema.Types.ObjectId ,
         ref : 'admin'
     },

       otp : {
         type : Number
       }
}, { timestamps : true })

const adminOtp_Model = mongoose.model('admin_OTP' , adminOtp)
module.exports = adminOtp_Model