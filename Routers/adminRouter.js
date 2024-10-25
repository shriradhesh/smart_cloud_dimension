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
      router.post('/add_service',upload.single('icon') ,  adminController.add_service)
      // Api for get_services
      router.get('/get_services', adminController.get_services)
      // Api for update_service
      router.put('/update_service/:service_id', upload.single('service_icon'), adminController.update_service)
      // Api for delete_service
      router.delete('/delete_service/:service_id', adminController.delete_service)
   

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

                                              /* cms Section  */

      router.post('/cms_home_why_you_choose_services', adminController.cms_home_why_you_choose_services)
      // Api for get_cms_home_why_you_choose_services
      router.get('/get_cms_home_why_you_choose_services', adminController.get_cms_home_why_you_choose_services)
      // Api for cms_home_service_smart_servelliance_system
      router.post('/cms_home_service_smart_servelliance_system', upload.single('image'), adminController.cms_home_service_smart_servelliance_system)
      //Api for get_cms_home_service_smart_servelliance_system
      router.get('/get_cms_home_service_smart_servelliance_system', adminController.get_cms_home_service_smart_servelliance_system)
      // Api for cms_home_service_smart_attandence_system
      router.post('/cms_home_service_smart_attandence_system', upload.single('image'), adminController.cms_home_service_smart_attandence_system)
      // Api for get_cms_home_service_smart_attendence_system
      router.get('/get_cms_home_service_smart_attendence_system', adminController.get_cms_home_service_smart_attendence_system)
      // Api for cms_home_service_smart_Access_system
      router.post('/cms_home_service_smart_Access_system', upload.single('image'), adminController.cms_home_service_smart_Access_system)
      // Api for get_cms_home_service_smart_Access_system
      router.get('/get_cms_home_service_smart_Access_system', adminController.get_cms_home_service_smart_Access_system)
      // Api for cms_home_service_smart_office_system
      router.post('/cms_home_service_smart_office_system', upload.single('image'), adminController.cms_home_service_smart_office_system)
      // Api for get_cms_home_service_smart_office_system
      router.get('/get_cms_home_service_smart_office_system', adminController.get_cms_home_service_smart_office_system)
      // Api for cms_home_service_smart_security_system
      router.post('/cms_home_service_smart_security_system', upload.single('image'), adminController.cms_home_service_smart_security_system)
      // Api for get_cms_home_service_smart_security_system
      router.get('/get_cms_home_service_smart_security_system', adminController.get_cms_home_service_smart_security_system)
      // Api for cms_home_service_smart_home_system
      router.post('/cms_home_service_smart_home_system', upload.single('image') , adminController.cms_home_service_smart_home_system)
      // Api for get_cms_home_service_smart_home_system
      router.get('/get_cms_home_service_smart_home_system', adminController.get_cms_home_service_smart_home_system)

      // APi for cms_about_us_section
      router.post('/cms_about_us_section', upload.any(), adminController.cms_about_us_section)
      // APi for get_cms_about_us_section
      router.get('/get_cms_about_us_section', adminController.get_cms_about_us_section)

      // Api for cms_about_our_team
      router.post('/cms_about_our_team', upload.single('profile_image'), adminController.cms_about_our_team)
      // Api for get_cms_about_our_team
      router.get('/get_cms_about_our_team', adminController.get_cms_about_our_team)

                                   /* Contact US */

      router.post('/contact_us', adminController.contact_us)
      router.get('/get_all_contact_us_inq', adminController.get_all_contact_us_inq)

      router.post('/cms_contact_us_details', adminController.cms_contact_us_details)
      // Api for get_cms_contact_us_details
      router.get('/get_cms_contact_us_details', adminController.get_cms_contact_us_details)
      // Api for cms_contact_for_inquiry
      router.post('/cms_contact_for_inquiry', adminController.cms_contact_for_inquiry)
      // Api for get_cms_contactof_inquiry
      router.get('/get_cms_contactof_inquiry', adminController.get_cms_contactof_inquiry)
      // Api for cms_contact_our_location
      router.post('/cms_contact_our_location', adminController.cms_contact_our_location)
      // Api for get_cms_contact_our_location
      router.get('/get_cms_contact_our_location', adminController.get_cms_contact_our_location)



module.exports = router
