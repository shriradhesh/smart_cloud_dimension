const express = require('express')
const router = express.Router()
const adminController = require('../controller/adminController')
const upload = require('../upload')


                                                  /* Admin Panel */
    // Api for Admin login

      router.post('/login', adminController.login)
    // Api for getadmin
       router.get('/getadmin/:adminId', adminController.getadmin)
    // Api for updateAdmin
      router.put('/updateAdmin/:adminId', upload.single('Profile_image') , adminController.updateAdmin)
    // Api for change_admin_password
      router.post('/change_admin_password/:adminId', adminController.change_admin_password)
/* Forget Admin Password */
   
    // Api for otpGenerate
    router.post('/otpGenerate', adminController.otpGenerate)
    // Api for verify_otp
    router.post('/verify_otp', adminController.verify_otp)
    // Api for reset_password
    router.post('/reset_password/:adminId', adminController.reset_password)


                                                /* Engineer Section */
      // Api for add Engineer                                          
     router.post('/add_engineer', upload.single('profileImage'), adminController.add_engineer)
     // Api for get_all_engineers
     router.get('/get_all_engineers', adminController.get_all_engineers)
     // Api for get_Engineer
     router.get('/get_Engineer/:engg_id', adminController.get_Engineer)
     // Api for deleteEngg
     router.delete('/deleteEngg/:Engineer_id', adminController.deleteEngg)

                                                  /* service Section */
      // Api for add_service
      router.post('/add_service', adminController.add_service)
      // Api for get_services
      router.get('/get_services', adminController.get_services)
   

                                                /* Customer section */
      // Api for get_all_Customer
      router.get('/get_all_Customer', adminController.get_all_Customer)

      // Api for admin_dashboard
      router.get('/admin_dashboard', adminController.admin_dashboard)

                                                /* Enquiry Section */
      // Api for get all Enquiry
      router.get('/get_all_enquiry', adminController.get_all_enquiry)
      // Api for assing_enqRequest_to_engineer
      router.post('/assing_enqRequest_to_engineer/:enq_id' , adminController.assing_enqRequest_to_engineer)
      // APi for get_particular_enq_detail
      router.get('/get_particular_enq_detail/:enq_id', adminController.get_particular_enq_detail)

                                            /* Report Section */

      router.get('/export_engineer', adminController.export_engineer)
      // Api for export_customer
      router.get('/export_customer', adminController.export_customer)
      // Api for all_enquiry_export
      router.get('/all_enquiry_export', adminController.all_enquiry_export)



module.exports = router
