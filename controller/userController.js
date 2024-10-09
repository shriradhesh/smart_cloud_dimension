const engineer_model = require('../models/engineer')
const bcrypt = require('bcrypt')
const services_model = require('../models/service')
const user_Email = require('../utils/userEmail')
const customer_Model = require('../models/customer')
const cus_enq_Model = require('../models/cus_Enquiry')
const enginner_assign_enq_model = require('../models/engineer_assing_enq')
const cus_bill_Model = require('../models/cus_bill')
const htmlPdf = require('html-pdf-node');
const path  = require('path')
const fs = require('fs')




// Api for engineer Login

const engineer_login = async ( req , res)=> {
    try {
        const { phone_no, password } = req.body;
        if (!phone_no) {
            return res.status(400).json({
                success: false,
                message: "phone_no is Required",
            });
        }
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "password is Required",
            });
        }
        // Find Engineer by Phone_no
        const Engineer = await engineer_model.findOne({ phone_no : phone_no  });

        if (!Engineer) {
            return res.status(400).json({
                success: false,
                message: "phone_no incorrect"
            });
        }
            
        // Check if the stored password is in plain text
        if (Engineer.password && Engineer.password.startsWith("$2b$")) {
            // Password is already bcrypt hashed
            const passwordMatch = await bcrypt.compare(password, Engineer.password);

            if (!passwordMatch) {
                return res.status(400).json({
                    success: false,
                    message: "Password incorrect"
                });
            }
        } else {
            // Convert plain text password to bcrypt hash
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Update the stored password in the database
            Engineer.password = hashedPassword;               
            await Engineer.save();
        }

        return res.json({
            success: true,
            message: "Login Successfully ",
            datails: Engineer,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "server error",
        });
    }
}


// Api for update Engineer Profile
             const update_Enginner_detail = async( req , res )=> {
                   try {
                          const engg_id = req.params.engg_id
                          const { name , email , phone_no  } = req.body

                          // check for engg_id
                          if(!engg_id)
                          {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'Engineer Id Required'
                            })
                          }

                          // check for engineer
                          const Engg = await engineer_model.findOne({ Engineer_id : engg_id })
                          if(!Engg)
                          {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'Engineer Not Exist'
                            })
                          }

                          Engg.name = name 
                          Engg.email = email 
                          Engg.phone_no = phone_no
                           
                          if(req.file)
                          {
                               Engg.profileImage = req.file.filename
                          }

                          await Engg.save()
                          return res.status(200).json({
                             success : true ,
                             message : 'Engineer Details Updated Successfully'
                          })
                          
                   } catch (error) {
                      return res.status(500).json({
                         success : false ,
                         message : 'Server error',
                         error_message : error.message
                      })
                   }
             }

             // Api for Engineer Password

             const change_Engg_password = async (req, res) => {
                try {
                  const engg_id = req.params.engg_id;
                  const { oldPassword, newPassword, confirmPassword } = req.body;
              
                  // Check for Engineer ID
                  if (!engg_id) {
                    return res.status(400).json({
                      success: false,
                      message: 'Engineer ID is required',
                    });
                  }
              
                  // Check if Engineer exists
                  const engineer = await engineer_model.findOne({ Engineer_id: engg_id });
                  if (!engineer) {
                    return res.status(404).json({
                      success: false,
                      message: 'Engineer not found',
                    });
                  }
              
                  // Validate required fields
                  const requiredFields = ['oldPassword', 'newPassword', 'confirmPassword'];
                  for (let field of requiredFields) {
                    if (!req.body[field]) {
                      return res.status(400).json({
                        success: false,
                        message: `Required field ${field.replace("_", " ")} is missing`,
                      });
                    }
                  }
              
                  // Validate new password match
                  if (newPassword !== confirmPassword) {
                    return res.status(400).json({
                      success: false,
                      message: 'New password and confirm password do not match',
                    });
                  }
              
                  // Validate old password
                  const isOldPasswordValid = await bcrypt.compare(oldPassword, engineer.password);
                  if (!isOldPasswordValid) {
                    return res.status(400).json({
                      success: false,
                      message: 'Old password is incorrect',
                    });
                  }
              
                  // Hash the new password
                  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
              
                  // Update the engineer's password
                  engineer.password = hashedNewPassword;
              
                  // Email content
                  const emailContent = `
                    <p style="text-align: center; font-size: 20px; color: #333; font-weight: 600; margin-bottom: 30px;">Congratulations! Your Password Has Been Changed</p>
                    <p style="text-align: center; font-size: 16px; color: #666; margin-bottom: 20px;">Here are your updated account details:</p>
                    <div style="display: flex; justify-content: center; align-items: center;">
                      <div style="width: auto; max-width: 500px; background-color: #f5f5f5; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1); padding: 20px;">
                        <table style="width: 100%; border-collapse: collapse;">
                          <tr style="background-color: #fff;">
                            <td style="padding: 14px 20px; text-align: left; font-weight: 600; font-size: 16px; border-bottom: 1px solid #e0e0e0;">Email:</td>
                            <td style="padding: 14px 20px; text-align: left; font-size: 16px; border-bottom: 1px solid #e0e0e0;">${engineer.email}</td>
                          </tr>
                          <tr style="background-color: #fff;">
                            <td style="padding: 14px 20px; text-align: left; font-weight: 600; font-size: 16px; border-bottom: 1px solid #e0e0e0;">Phone No:</td>
                            <td style="padding: 14px 20px; text-align: left; font-size: 16px; border-bottom: 1px solid #e0e0e0;">${engineer.phone_no}</td>
                          </tr>
                          <tr style="background-color: #fff;">
                            <td style="padding: 14px 20px; text-align: left; font-weight: 600; font-size: 16px;">Password:</td>
                            <td style="padding: 14px 20px; text-align: left; font-size: 16px;">${newPassword}</td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  `;
              
                  // Send email to the engineer
                  await user_Email(engineer.email, 'Password Changed Successfully', emailContent);
              
                  // Save the updated engineer record
                  await engineer.save();
              
                  return res.status(200).json({
                    success: true,
                    message: 'Password changed successfully',
                  });
                } catch (error) {
                  return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error_message: error.message,
                  });
                }
              };
              
                                                                            /*  Customer SEction */
            
                // APi for Signup Customer
                      const customer_signup = async ( req , res )=> {
                            try {
                                    const {name , email , phone_no , address } = req.body

                                    // check required fields

                                    if(!name)
                                    {
                                        return res.status(400).json({
                                             success : false ,
                                             message : 'name Required'
                                        })
                                    }

                            if(!email)
                                {
                                    return res.status(400).json({
                                            success : false ,
                                            message : 'Email Required'
                                    })
                                }

                                if(!phone_no)
                                    {
                                        return res.status(400).json({
                                                success : false ,
                                                message : 'Phone No Required'
                                        })
                                    }
                                if(!address)
                                    {
                                        return res.status(400).json({
                                                success : false ,
                                                message : 'address Required'
                                        })
                                    }
                                 
                                    const profileImage = req.file.filename
                                    const randomNumber = generateRandomNumber(4);
                                    const customer_id = `CUS-${randomNumber}`;
                                      // check for exist customer

                                      const exist_customer = await customer_Model.findOne({ email })
                                      if(exist_customer)
                                      {
                                        return res.status(400).json({
                                             success : false ,
                                             message : 'Customer Already Exist'
                                        })
                                      }

                                      // Add new Customer

                                      const new_Customer = new customer_Model({
                                          name ,
                                          email,
                                          phone_no ,
                                          profileImage,
                                          address ,
                                          customer_id : customer_id
                                      })

                                      await new_Customer.save()

                                         return res.status(200).json({
                                             success : true ,
                                             message : 'Successfully Registerd',
                                             Details : new_Customer
                                         })
                                     
                                 
                            } catch (error) {
                                 return res.status(500).json({
                                     success : false ,
                                     message : 'Server error',
                                     error_message : error.message
                                 })
                            }
                      }

                      // Function to generate a random number
        function generateRandomNumber(length) {
            let result = '';
            const characters = '0123456789';
            const charactersLength = characters.length;
        
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
        
            return result;
        }

        
    // Api for customer login

            const customer_login = async ( req , res )=> {
                   try {
                              const { phone_no } = req.body
                            
                              // check for phone_no
                              if(!phone_no)
                              {
                                return res.status(400).json({
                                     success : false ,
                                     message : 'Phone Number Required'
                                })
                              }

                              // Check for customer
                              const customer = await customer_Model.findOne({ phone_no })
                              if(!customer)
                              {
                                return res.status(400).json({
                                     success : false ,
                                     message : 'Customer Not Exist'
                                })
                              }

                              return res.status(200).json({
                                 success : true ,
                                 message : 'Customer login Successfully' ,
                                 Detail : customer
                              })
                   } catch (error) {
                      return res.status(500).json({
                         success : false ,
                         message : 'Server error',
                         error_message : error.message
                      })
                   }
            }
       

            // Api for update customer details
              const update_customer = async( req , res )=> {
                    try {
                              const customer_id  = req.params.customer_id
                              const { name , email , phone_no , address } = req.body
                              // check for customer id
                              if(!customer_id)
                              {
                                return res.status(400).json({
                                     success : false ,
                                     message : 'Customer Id Required'
                                })
                              }

                              // check for customer 
                              const customer = await customer_Model.findOne({ customer_id  })
                              if(!customer)
                              {
                                return res.status(400).json({
                                     
                                         success : false ,
                                         message : 'Customer not Exist'
                                      })                                
                              }

                                 customer.name = name 
                                 customer.email = email
                                 customer.phone_no = phone_no
                                 customer.address = address

                                 if(req.file)
                                 {
                                    customer.profileImage = req.file.filename
                                 }

                                  await customer.save()
                                  return res.status(200).json({
                                     success : true ,
                                     message : 'Details Updated Successfully'
                                  })

                                  
                    } catch (error) {
                         return res.status(500).json({
                             success : false ,
                             message : 'Server error',
                             error_message : error.message
                         })
                    }
              }

   

                                                                /* Customer EnqUiry Section */

              // Api for Generatre Enquiry for service

              const generate_enq = async (req, res) => {
                try {
                    const customer_id = req.params.customer_id;
                    const { services, customer_name, customer_email, customer_phone_no, customer_address, subject, message } = req.body;
            
                    // Check for customer_id
                    if (!customer_id) {
                        return res.status(400).json({ success: false, message: 'Customer Id Required' });
                    }
            
                    // Check for customer
                    const customer = await customer_Model.findOne({ customer_id });
                    if (!customer) {
                        return res.status(400).json({
                            success: false,
                            message: 'Customer Not Exist'
                        });
                    }
            
                    // Check for required fields
                    if (!services || services.length === 0) {
                        return res.status(400).json({
                            success: false,
                            message: 'At least one service is required'
                        });
                    }
            
                    if (!message) {
                        return res.status(400).json({
                            success: false,
                            message: 'Message Required'
                        });
                    }
                    if (!customer_name) {
                        return res.status(400).json({
                            success: false,
                            message: 'Customer Name Required'
                        });
                    }
                    if (!customer_email) {
                        return res.status(400).json({
                            success: false,
                            message: 'Customer Email Required'
                        });
                    }
                    if (!customer_phone_no) {
                        return res.status(400).json({
                            success: false,
                            message: 'Customer Phone Number Required'
                        });
                    }
                    if (!customer_address) {
                        return res.status(400).json({
                            success: false,
                            message: 'Customer Address Required'
                        });
                    }
            
                    // Validate services and collect service details
                    const serviceDetails = [];
                    for (const service of services) {
                        const serviceData = await services_model.findOne({ _id: service.service_id });
                        if (!serviceData) {
                            return res.status(400).json({
                                success: false,
                                message: `Service Not Found for ID: ${service.service_id}`
                            });
                        }
                        serviceDetails.push({
                            service_id: service.service_id,
                            service_name: serviceData.service_name,
                            service_price : serviceData.service_price
                        });
                    }
            
                    const randomNumber = generateRandomNumber(4);
                    const Enq_no = `ENQ${randomNumber}`;
            
                    // Generate new Enquiry
                    const new_enq = new cus_enq_Model({
                        Enq_no: Enq_no,
                        customer_id,
                        customer_name,
                        customer_email,
                        customer_phone_no,
                        customer_address,
                        services: serviceDetails,
                        subject,
                        message,
                        status: 'Pending'
                    });
            
                    await new_enq.save();
            
                    // Bill Generate automatically
                    const bill_no = `INV${randomNumber}`;
                    const bill_generate = new cus_bill_Model({
                        bill_no: bill_no,
                        Enq_no: Enq_no,
                        cus_Id: new_enq.customer_id,
                        cus_name: new_enq.customer_name,
                        services: new_enq.services.map(service => ({
                            service_id: service.service_id,
                            service_name: service.service_name,
                            service_price : service.service_price
                            
                        })),
                        total_bill_amount: 0,
                        bill_status: 'Pending'
                    });
            
                    await bill_generate.save();
            
                    const emailContent = `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Email Confirmation</title>
                        </head>
                        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; color: #333; margin: 0; padding: 0;">
                            <div style="width: 100%; max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1); padding: 40px; border: 1px solid #e3e6e8;">
                                <div style="text-align: center; border-bottom: 1px solid #e3e6e8; padding-bottom: 20px; margin-bottom: 20px;">
                                    <h1 style="color: #004b8d; font-size: 28px; margin-bottom: 10px;">Thank You for Your Inquiry!</h1>
                                </div>
                                <p style="font-size: 16px; line-height: 1.8; color: #4a4a4a;">Dear <strong>${customer_name}</strong>,</p>
                                <p style="font-size: 16px; line-height: 1.8; color: #4a4a4a;">We are pleased to confirm that we have successfully received your inquiry regarding our <span style="font-weight: bold; color: #004b8d;">${serviceDetails.map(service => service.service_name).join(', ')}</span> services.</p>
                                <div style="background-color: #f1f3f4; padding: 15px; border-radius: 6px; margin-bottom: 20px; color: #333;">
                                    Your Inquiry Number: <span style="font-weight: bold; color: #004b8d;">${new_enq.Enq_no}</span>
                                </div>
                                <p style="font-size: 16px; line-height: 1.8; color: #4a4a4a;">Our team will review your request and get back to you shortly with the next steps. If you have any immediate questions, feel free to reply to this email.</p>
                                <p style="margin-top: 30px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">Best regards,<br>                       
                                    Smart Cloud Dimension
                                </p>
                                <a href="mailto:Sales@smartclouddimensions.net" style="display: inline-block; padding: 12px 24px; margin-top: 20px; background-color: #004b8d; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">Contact Us</a>
                                <div style="text-align: center; font-size: 13px; color: #888; margin-top: 40px; border-top: 1px solid #e3e6e8; padding-top: 15px;">
                                    <p>If you need further assistance, feel free to reach out to us at <a href="mailto:Sales@smartclouddimensions.net" style="color: #004b8d; text-decoration: none;">Sales@smartclouddimensions.net</a></p>
                                    <p>&copy;  Smart Cloud Dimension. All rights reserved.</p>
                                </div>
                            </div>
                        </body>
                        </html>`;
            
                    await user_Email(customer_email, 'Email Confirmation', emailContent);
            
                    return res.status(200).json({
                        success: true,
                        message: `New Enquiry Generated for services: ${serviceDetails.map(service => service.service_name).join(', ')}`
                    });
            
                } catch (error) {
                    return res.status(500).json({
                        success: false,
                        message: 'Server error',
                        error_message: error.message
                    });
                }
            }
            
              
      // Api for get customer Enquiry
                       const get_cus_enquiry = async( req , res )=> {
                            try {
                                   const customer_id = req.params.customer_id
                                   // check for customer_id
                                   if(!customer_id)
                                   {
                                    return res.status(400).json({
                                         success : false ,
                                         message : 'Customer Id required'
                                    })
                                   }

                                   // check for customer
                                   const customer = await customer_Model.findOne({ customer_id })
                                   if(!customer)
                                   {
                                    return res.status(400).json({
                                          success : false ,
                                          message : 'Customer Not Exist'
                                    })
                                   }

                                   // check for all Enquiry Generted by Customer
                                   const cus_all_enq = await cus_enq_Model.find({ customer_id }).sort({ createdAt : -1  }).lean()
                                   
                                      if(!cus_all_enq)
                                      {
                                        return res.status(400).json({
                                             success : false ,
                                             message : 'No Enquiry Generated Yet for customer'
                                        })
                                      }
                                      return res.status(200).json({
                                            success : true ,
                                            message : 'Customer Enquiry',
                                            cus_enq : cus_all_enq
                                      })

                            } catch (error) {
                                 return res.status(500).json({
                                     success : false ,
                                     message : 'Server error',
                                     error_message : error.message
                                 })
                            }
                       }
                  
    // Api for get Engineer's all enquiry

    const get_all_enquiry_of_engineer = async (req, res) => {
      try {
          const engineer_id = req.params.engineer_id;
          
          // Check for engineer_id
          if (!engineer_id) {
              return res.status(400).json({
                  success: false,
                  message: 'Engineer ID Required'
              });
          }
  
          // Check if the engineer exists
          const engg = await engineer_model.findOne({ Engineer_id: engineer_id });
          if (!engg) {
              return res.status(400).json({
                  success: false,
                  message: 'Engineer Not Exist'
              });
          }
  
          // Get all assigned enquiries of the engineer
          const all_enq = await enginner_assign_enq_model.find({ engineer_id }).sort({ createdAt: -1 }).lean();
          if (!all_enq || all_enq.length === 0) {
              return res.status(400).json({
                  success: false,
                  message: 'No Enquiry Assigned yet to your account'
              });
          }

                // get bi
             
                              
          // Map through each enquiry to get details based on Enq_no
          const enquiry_details = await Promise.all(
              all_enq.map(async (enquiry) => {
                  // Assuming `cus_enq_Model` is the model containing the detailed information
                  const details = await cus_enq_Model.findOne({ Enq_no: enquiry.Enq_no }).lean();
  
                  return {
                      Enq_no: enquiry.Enq_no,
                      engineer_id: enquiry.engineer_id,                      
                      customer_name : details.customer_name,
                      customer_email : details.customer_email,
                      customer_phone_no : details.customer_phone_no,
                      customer_address : details.customer_address , 
                      subject : details.subject,
                      message : details.message,
                      status : details.status,
                      Bill : enquiry.Bill
                      

                  };
              })
          );
  
          return res.status(200).json({
              success: true,
              message: 'All Assigned Enquiries',
              all_enq: enquiry_details
          });
      } catch (error) {
          return res.status(500).json({
              success: false,
              message: 'Server error',
              error_message: error.message
          });
      }
  };
  

//      // Api for confirmed and cancelled the Enquiry Request of the customer
//      const accept_reject_cus_enq = async (req, res) => {
//       try {
//           const cus_id = req.params.cus_id;
//           const status = req.query.status;
  
//           // Check for cus_id
//           if (!cus_id) {
//               return res.status(400).json({
//                   success: false,
//                   message: 'Customer Id Required'
//               });
//           }
  
//           // Check if the customer exists
//           const cus = await customer_Model.findOne({ customer_id: cus_id });
//           if (!cus) {
//               return res.status(400).json({
//                   success: false,
//                   message: 'Customer not found'
//               });
//           }
  
//           // Check for customer enquiry
//           const cus_enq = await cus_enq_Model.findOne({ customer_id: cus_id });
//           if (!cus_enq) {
//               return res.status(400).json({
//                   success: false,
//                   message: 'Enquiry not found'
//               });
//           }
  
//           // Access assigned engineer data
//           const assign_enq = await enginner_assign_enq_model.findOne({ customer_id: cus_id });
//           if (!assign_enq) {
//               return res.status(400).json({
//                   success: false,
//                   message: 'No assigned engineer found for this enquiry'
//               });
//           }
  
//           // Access engineer details
//           const engg = await engineer_model.findOne({ Engineer_id: assign_enq.engineer_id });
//           if (!engg) {
//               return res.status(400).json({
//                   success: false,
//                   message: 'Engineer not found'
//               });
//           }
  
//           let emailContent = '';
  
//           // Handle status update
//           if (status === '1') {
//               cus_enq.status = 'Confirmed';
  
//               // Construct the "Confirmed" email content
//               emailContent = `
//                   <!DOCTYPE html>
//                   <html lang="en">
//                   <head>
//                       <meta charset="UTF-8">
//                       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                       <title>Email Confirmation</title>
//                   </head>
//                   <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; color: #333; margin: 0; padding: 0;">
//                       <div style="width: 100%; max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1); padding: 40px; border: 1px solid #e3e6e8;">
//                           <div style="text-align: center; border-bottom: 1px solid #e3e6e8; padding-bottom: 20px; margin-bottom: 20px;">
//                               <h1 style="color: #004b8d; font-size: 28px; margin-bottom: 10px;">Thank You for Your Inquiry!</h1>
//                           </div>
//                           <p style="font-size: 16px; line-height: 1.8; color: #4a4a4a;">Dear <strong>${cus.name}</strong>,</p>
//                           <p style="font-size: 16px; line-height: 1.8; color: #4a4a4a;">We are pleased to confirm that your request regarding our <span style="font-weight: bold; color: #004b8d;">${cus_enq.service_name}</span> service has been successfully received.</p>
//                           <div style="background-color: #f1f3f4; padding: 15px; border-radius: 6px; margin-bottom: 20px; color: #333;">
//                               Your Inquiry Number: <span style="font-weight: bold; color: #004b8d;">${cus_enq.Enq_no}</span>
//                           </div>
//                           <p style="font-size: 16px; line-height: 1.8; color: #4a4a4a;">Your request is confirmed, and our team will begin working on it soon. One of our engineers will be in contact with you in a few days to discuss the next steps and provide any additional information you may need.</p>
//                           <p style="font-size: 16px; line-height: 1.8; color: #4a4a4a;">Here are the contact details of the assigned engineer:</p>
                          
//                           <ul style="font-size: 16px; line-height: 1.8; color: #4a4a4a;">
//                               <li><strong>Engineer Name:</strong> ${engg.name}</li>
//                               <li><strong>Email:</strong> <a href="mailto:${engg.email}" style="color: #004b8d; text-decoration: none;">${engg.email}</a></li>
//                               <li><strong>Phone:</strong> ${engg.phone_no}</li>
//                           </ul>
//                           <p style="font-size: 16px; line-height: 1.8; color: #4a4a4a;">Our team is dedicated to addressing your request as soon as possible. If you have any immediate questions, feel free to contact the engineer directly or reply to this email.</p>
//                           <p style="margin-top: 30px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
//                               Best regards,<br>                       
//                               Smart Cloud Dimension
//                           </p>
//                           <a href="mailto:Sales@smartclouddimensions.net" style="display: inline-block; padding: 12px 24px; margin-top: 20px; background-color: #004b8d; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">Contact Us</a>
//                           <div style="text-align: center; font-size: 13px; color: #888; margin-top: 40px; border-top: 1px solid #e3e6e8; padding-top: 15px;">
//                               <p>If you need further assistance, feel free to reach out to us at <a href="mailto:Sales@smartclouddimensions.net" style="color: #004b8d; text-decoration: none;">Sales@smartclouddimensions.net</a></p>
//                               <p>&copy;  Smart Cloud Dimension. All rights reserved.</p>
//                           </div>
//                       </div>
//                   </body>
//                   </html>
//               `;
  
//           } else if (status === '2') {
//               cus_enq.status = 'Cancelled';
  
//               // Construct the "Cancelled" email content
//               emailContent = `
//                   <!DOCTYPE html>
//                   <html lang="en">
//                   <head>
//                       <meta charset="UTF-8">
//                       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                       <title>Enquiry Cancelled</title>
//                   </head>
//                   <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; color: #333; margin: 0; padding: 0;">
//                       <div style="width: 100%; max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1); padding: 40px; border: 1px solid #e3e6e8;">
//                           <div style="text-align: center; border-bottom: 1px solid #e3e6e8; padding-bottom: 20px; margin-bottom: 20px;">
//                               <h1 style="color: #dc3545; font-size: 28px; margin-bottom: 10px;">Enquiry Cancelled</h1>
//                           </div>
//                           <p style="font-size: 16px; line-height: 1.8; color: #4a4a4a;">Dear <strong>${cus.name}</strong>,</p>
//                           <p style="font-size: 16px; line-height: 1.8; color: #4a4a4a;">We regret to inform you that your enquiry regarding the <span style="font-weight: bold; color: #004b8d;">${cus_enq.service_name}</span> service has been cancelled.</p>
//                           <div style="background-color: #f1f3f4; padding: 15px; border-radius: 6px; margin-bottom: 20px; color: #333;">
//                               Your Inquiry Number: <span style="font-weight: bold; color: #004b8d;">${cus_enq.Enq_no}</span>
//                           </div>
//                           <p style="font-size: 16px; line-height: 1.8; color: #4a4a4a;">If you believe this was done in error or wish to resubmit your request, please contact our support team, and we will be happy to assist you.</p>
//                           <p style="margin-top: 30px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
//                               Best regards,<br>                       
//                               Smart Cloud Dimension
//                           </p>
//                           <a href="mailto:Sales@smartclouddimensions.net" style="display: inline-block; padding: 12px 24px; margin-top: 20px; background-color: #004b8d; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">Contact Us</a>
//                           <div style="text-align: center; font-size: 13px; color: #888; margin-top: 40px; border-top: 1px solid #e3e6e8; padding-top: 15px;">
//                               <p>If you need further assistance, feel free to reach out to us at <a href="mailto:Sales@smartclouddimensions.net" style="color: #004b8d; text-decoration: none;">Sales@smartclouddimensions.net</a></p>
//                               <p>&copy;  Smart Cloud Dimension. All rights reserved.</p>
//                           </div>
//                       </div>
//                   </body>
//                   </html>
//               `;
//           }
  
//           // Save the updated status to the database
//           await cus_enq.save();
  
//           // Send the email to the customer (pseudo function)
//           await user_Email(cus_enq.customer_email , 'Enquiry Email' , emailContent )
          
  
//           return res.status(200).json({
//               success: true,
//               message: `Enquiry ${status === '1' ? 'Confirmed' : 'Cancelled'} `
//           });
  
//       } catch (error) {
//           return res.status(500).json({
//               success: false,
//               message: error.message
//           });
//       }
//   };
  


  // Api for update customer bill
  const update_cus_bill = async (req, res) => {
    try {
        const { engineer_id, bill_no } = req.params;
        const { services } = req.body; // services can be undefined

        // Check for required fields
        if (!engineer_id) {
            return res.status(400).json({
                success: false,
                message: 'Engineer Id is required'
            });
        }

        if (!bill_no) {
            return res.status(400).json({
                success: false,
                message: 'Bill No is required'
            });
        }

        // Find the bill by bill number
        const bill = await cus_bill_Model.findOne({ bill_no });
        if (!bill) {
            return res.status(400).json({
                success: false,
                message: 'Bill not found'
            });
        }

        // Check for Enquiry
        const enq = await cus_enq_Model.findOne({ Enq_no: bill.Enq_no });
        if (!enq) {
            return res.status(400).json({
                success: false,
                message: 'Enquiry not found'
            });
        }

        // Validate each service if provided and add it to the bill's service list if valid
        if (services && Array.isArray(services) && services.length > 0) {
            const serviceDetails = [];
            for (const service of services) {
                const serviceData = await services_model.findOne({ _id: service.service_id });
                if (!serviceData) {
                    return res.status(400).json({
                        success: false,
                        message: `Service not found for Id: ${service.service_id}`
                    });
                }
                serviceDetails.push({
                    service_id: serviceData._id,
                    service_name: serviceData.service_name,
                    service_price: serviceData.service_price
                });
            }

            // Append new services to existing services
            bill.services = [...bill.services, ...serviceDetails];
        }

        // Calculate the total bill amount by summing the price of all services (existing and new)
        bill.total_bill_amount = bill.services.reduce((total, service) => total + service.service_price, 0);

        // Save the updated bill
        await bill.save();
                
                
        // Define directory and ensure it exists
        const uploadsDir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const bill_generate_date = bill.createdAt;
        const date = new Date(bill_generate_date);
        const options = {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            timeZone: 'Asia/Riyadh',
            timeZoneName: 'short'
        };
        
        // Format the date using `toLocaleDateString` with the specified options
        const formattedDate = date.toLocaleDateString('en-US', options);

        const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bill Invoice</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <div style="max-width: 800px; margin: 20px auto; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 20px; border: 1px solid #ddd;">
        <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 28px; color: #333;">Billing Invoice</h1>
             <p style="font-size: 14px; color: #666;">Invoice Number: ${bill_no}</p>
            <p style="font-size: 14px; color: #666;">Invoice Date: ${formattedDate}</p>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 40px; flex-wrap: wrap;">
            <div style="width: 45%; margin-bottom: 20px;">
                <h3 style="font-size: 18px; margin-bottom: 10px; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Customer Information</h3>
                <p style="font-size: 14px; margin-bottom: 5px; color: #555;"><strong>Name:</strong> ${bill.cus_name}</p>
                <p style="font-size: 14px; margin-bottom: 5px; color: #555;"><strong>Email:</strong> ${enq.customer_email}</p>
                <p style="font-size: 14px; margin-bottom: 5px; color: #555;"><strong>Phone:</strong> ${enq.customer_phone_no}</p>
                <p style="font-size: 14px; margin-bottom: 5px; color: #555;"><strong>Address:</strong> ${enq.customer_address}</p>
            </div>

            <div style="width: 45%; margin-bottom: 20px;">
                <h3 style="font-size: 18px; margin-bottom: 10px; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Service Information</h3>
                ${bill.services && bill.services.length > 0 ? 
                    bill.services.map(service => `
                    <div style="margin-bottom: 10px;">
                        <p style="font-size: 14px; margin-bottom: 5px; color: #555;"><strong>Service Name:</strong> ${service.service_name}</p>
                        <p style="font-size: 14px; margin-bottom: 5px; color: #555;"><strong>Service Price:</strong> ₹${service.service_price}</p>
                    </div>
                    `).join('') : 
                    '<p style="font-size: 14px; margin-bottom: 5px; color: #555;">No services added.</p>'
                }
            </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; border: 1px solid #ddd;">
            <thead>
                <tr>
                    <th style="padding: 15px; border: 1px solid #ddd; font-size: 14px; color: #333; background-color: #f0f0f0; text-align: left;">Description</th>
                    <th style="padding: 15px; border: 1px solid #ddd; font-size: 14px; color: #333; background-color: #f0f0f0; text-align: left;">Price</th>
                </tr>
            </thead>
            <tbody>
                ${bill.services && bill.services.length > 0 ? 
                    bill.services.map(service => `
                    <tr>
                        <td style="padding: 15px; border: 1px solid #ddd; font-size: 14px; color: #555;">${service.service_name}</td>
                        <td style="padding: 15px; border: 1px solid #ddd; font-size: 14px; color: #555;">₹${service.service_price}</td>
                    </tr>
                    `).join('') : 
                    '<tr><td colspan="2" style="padding: 15px; border: 1px solid #ddd; font-size: 14px; color: #555; text-align: center;">No services added.</td></tr>'
                }
            </tbody>
        </table>

        <div style="text-align: right; margin-bottom: 30px;">
            <h2 style="font-size: 22px; color: #333;">Total Amount: ₹${bill.total_bill_amount}</h2>
        </div>

        <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
            <div style="width: 45%; margin-bottom: 20px;">
                <h3 style="font-size: 18px; margin-bottom: 10px; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Payment Information</h3>
                <p style="font-size: 14px; margin-bottom: 5px; color: #555;"><strong>Due Date:</strong> ${formattedDate}</p>
                <p style="font-size: 14px; margin-bottom: 5px; color: #555;"><strong>Status:</strong> <span style="color: #fff; background-color: red; padding: 5px 10px; border-radius: 5px;">${bill.bill_status}</span></p>
            </div>
        </div>

        <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="font-size: 12px; color: #999;">This is a computer-generated bill, no signature required.</p>
            <p style="font-size: 12px; color: #999;">Thank you for your business!</p>
        </div>
    </div>
</body>
</html>
`;

        // Generate PDF from HTML and save it
    
     


        const pdfFilename = `bill_${bill.bill_no}.pdf`      
        const pdfPath = path.join(uploadsDir, pdfFilename);

        // Convert HTML to PDF
        const pdfBuffer = await htmlPdf.generatePdf({ content: htmlContent }, { format: 'A4' });

        fs.writeFileSync(pdfPath, pdfBuffer);

        // Attach PDF path to the new bill
        bill.bill_pdf = `bill_${bill.bill_no}.pdf`;

            await bill.save()

            // check for assign_engg_section
            const assign_engg_section = await enginner_assign_enq_model.findOne({ Enq_no : bill.Enq_no

            })

             // Validate each service if provided and add it to the bill's service list if valid
        if (services && Array.isArray(services) && services.length > 0) {
            const serviceDetails = [];
            for (const service of services) {
                const serviceData = await services_model.findOne({ _id: service.service_id });
                if (!serviceData) {
                    return res.status(400).json({
                        success: false,
                        message: `Service not found for Id: ${service.service_id}`
                    });
                }
                serviceDetails.push({
                    service_id: serviceData._id,
                    service_name: serviceData.service_name,
                    service_price: serviceData.service_price
                });
            }

            // Append new services to existing services
            assign_engg_section.Bill[0].total_Bill = bill.total_bill_amount
            assign_engg_section.Bill[0].services = [...assign_engg_section.Bill[0].services, ...serviceDetails];

        }
           
            await assign_engg_section.save()

            enq.bill_pdf = bill.bill_pdf
            enq.status = 'Confirmed'
            enq.save()
            
        // Respond with the updated bill
        res.status(200).json({
            success: true,
            message: 'Bill updated successfully',
           
          
        });
    } catch (error) {
        console.error('Error updating bill:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};


              
  


         
module.exports = {
    engineer_login , update_Enginner_detail , change_Engg_password , 
    customer_signup ,  customer_login , update_customer ,
    generate_enq , get_cus_enquiry , get_all_enquiry_of_engineer ,
    update_cus_bill
    // accept_reject_cus_enq ,

}