const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const upload = require('../upload')

                                                /* Engineer Section */

// Api for engineer_login
router.post('/engineer_login', userController.engineer_login)
// Api for update_Enginner_detail
router.put('/update_Enginner_detail/:engg_id', upload.single('profileImage'), userController.update_Enginner_detail)
// Api for change_Engg_password
router.post('/change_Engg_password/:engg_id', userController.change_Engg_password)

// Api for get_all_enquiry_of_engineer
router.get('/get_all_enquiry_of_engineer/:engineer_id', userController.get_all_enquiry_of_engineer)
// Api for update_cus_bill
router.post('/update_cus_bill/:engineer_id/:bill_no', userController.update_cus_bill)
// // Api for accept_reject_cus_enq
// router.post('/accept_reject_cus_enq/:cus_id', userController.accept_reject_cus_enq)

//                                              /* Customer Section */

// Api for customer_signup
router.post('/customer_signup', upload.single('profileImage'), userController.customer_signup)
// Api for customer_login
router.post('/customer_login' , userController.customer_login)
// Api for update_customer
router.put('/update_customer/:customer_id', upload.single('profileImage'), userController.update_customer)

  

                                            /* Service REquest */

// Api for Generate Enquiry

 router.post('/generate_enq/:customer_id' , userController.generate_enq)
// Api for get_cus_enquiry
router.get('/get_cus_enquiry/:customer_id', userController.get_cus_enquiry)











module.exports = router