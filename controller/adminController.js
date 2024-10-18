const mongoose = require('mongoose')
const adminModel = require('../models/admin')
const bcrypt = require('bcrypt')
const send_adminEmail = require('../utils/send_adminEmail')
const adminOtp_Model = require('../models/adminOtp_Model')
const engineer_model = require('../models/engineer')
const services_model = require('../models/service')
const user_Email = require('../utils/userEmail')
const customer_Model = require('../models/customer')
const cus_enq_Model = require('../models/cus_Enquiry')
const enginner_assign_enq_model = require('../models/engineer_assing_enq')
const ExcelJs = require("exceljs");
const cus_bill_Model = require('../models/cus_bill')
const engineer_rating_model = require('../models/engineer_rating')
const cms_home_why_you_choose_services_Model = require('../models/cms_home_why_you_choose_services')
const cms_home_service_smart_servelliance_system_Model = require('../models/cms_home_service_smart_servelliance_system')
const cms_home_service_smart_attendence_system_Model = require('../models/cms_home_service_Smart_Attendance_Systems')
const cms_home_service_smart_Access_system_Model = require('../models/cms_home_service_smart_access')
const cms_home_service_smart_office_system_Model = require('../models/cms_home_service_smart_office_system')
const cms_home_service_smart_security_system_Model = require('../models/cms_home_service_smart_security_system')
const cms_home_service_smart_home_system_Model = require('../models/cms_home_service_smart_home_section')
const contact_us_Model = require('../models/contact_us')
const cms_contact_us_details_model = require('../models/cms_contact_details')
const cms_contact_for_inquiry_Model = require('../models/cms_contact_for_inquiry')
const cms_contact_our_location_Model = require('../models/cms_contact_our_location')


                                                 /* Admin Panel */

  // Admin login
                                          
  const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for email
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        // Check for password
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required",
            });
        }

        // Find Admin by email
        const admin = await adminModel.findOne({ email });

        if (!admin) {
            return res.status(400).json({
                success: false,
                message: "Email is incorrect",
            });
        }

        // Check if password is already bcrypt hashed
        if (admin.password && admin.password.startsWith("$2b$")) {
            const passwordMatch = await bcrypt.compare(password, admin.password);

            if (!passwordMatch) {
                return res.status(400).json({
                    success: false,
                    message: "Password is incorrect",
                });
            }
        } else {
            // If the password is stored as plain text (which is a bad practice),
            // hash it and update the stored password for future logins.
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Update the stored password in the database
            admin.password = hashedPassword;
            await admin.save();
        }
           
        return res.status(200).json({
            success: true,
            message: "Login successfully",
            data: admin,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error_message: error.message,
        });
    }
};

// Api for get admin detials
const getadmin =  async ( req , res )=> {
    try {
         const adminId = req.params.adminId
       // check for adminID
       if(!adminId)
       {
             return res.status(400).json({
                success : false ,
                message : 'admin Id required'
             })
       }

       // check for admin
       const admin = await adminModel.findOne({
             _id : adminId
       })

        if(!admin)
        {
           return res.status(400).json({
                success : false ,
                message : 'Admin Not found'
           })
        }

        return res.status(200).json({
            success : true ,
            message : 'admin Details',
            Details : admin
        })
    } catch (error) {
        return res.status(500).json({
           success : false,
           message : 'server error',
           error_message : error.message
        })
    }
}

// Api for update admin details
const updateAdmin  = async ( req , res )=> {
    try {
            const adminId = req.params.adminId
            const { full_name , email } = req.body
            // check for adminId
       if(!adminId)
       {
           return res.status(400).json({
                success : false ,
                message : 'admin Id not found'
           })
       }

       // check for admin
           const admin  = await adminModel.findOne({
                 _id : adminId
           })

           if(!admin)
           {
                 return res.status(400).json({
                    success : false ,
                    message : 'admin not found'
                 })
           }

           // check for details and uodate

           
           if (full_name) admin.full_name = full_name;
           if (email) admin.email = email;

           // Update profile image only if a new file is uploaded
           if (req.file && req.file.filename) {
               admin.Profile_image = req.file.filename;
           }
           await admin.save()
           return res.status(200).json({
                success : true ,
                message : 'admin details updated'
           })
    } catch (error) {
        return res.status(500).json({
            success : false ,
            message : 'server error',
            error_message : error.message
        })
    }
}

const change_admin_password = async ( req , res )=> {
    try {
         const adminId = req.params.adminId
         const { oldPassword , newPassword , confirmPassword } = req.body
       
   // check for adminId
       if(!adminId)
       {
            return res.status(400).json({
                success : false ,
                message : 'admin id required'
            })
       }

       // check for admin
       const admin = await adminModel.findOne({ _id : adminId })
       if(!admin)
       {
            return res.status(400).json({
                success : false ,
                message : 'admin not found'
            })
       }

       // check for required fields

    const requiredFields = ['oldPassword' , 'newPassword' , 'confirmPassword']
     for(let field of requiredFields)
     {
          if(!req.body[field])
          {
              return res.status(400).json({
                   success : false ,
                   message : `Required ${field.replace("_", " ")} `
              })
          }
     }

     // check for newPassword and confirmPassword is matched or not
       if(newPassword !== confirmPassword)
       {
             return res.status(400).json({
                   success : false ,
                   message : 'confirm Password not matched'
             })
       }

         // check for old password , is oldpassword is matched with stored password

         const isOldPasswordValid = await bcrypt.compare(
           oldPassword,
           admin.password
         ); 

            if(!isOldPasswordValid)
            {
                 return res.status(400).json({
                    success : false ,
                    message : 'old password is not valid'
                 })
            }

            // bcrypt new password

            const hashedNewPassword = await bcrypt.hash( newPassword , 10 )

            admin.password = hashedNewPassword
            const adminEmailContent = `
<p style="text-align: center; font-size: 20px; color: #333; font-weight: 600; margin-bottom: 30px;">Congratulations! Your Password Has Been Changed</p>
<p style="text-align: center; font-size: 16px; color: #666; margin-bottom: 20px;">Here are your account details:</p>

<div style="display: flex; justify-content: center; align-items: center;">
<div style="width: auto; max-width: 500px; background-color: #f5f5f5; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1); padding: 20px;">
<table style="width: 100%; border-collapse: collapse;">
<tr style="background-color: #fff;">
<td style="padding: 14px 20px; text-align: left; font-weight: 600; font-size: 16px; border-bottom: 1px solid #e0e0e0;">Email:</td>
<td style="padding: 14px 20px; text-align: left; font-size: 16px; border-bottom: 1px solid #e0e0e0;">${admin.email}</td>
</tr>
<tr style="background-color: #fff;">
<td style="padding: 14px 20px; text-align: left; font-weight: 600; font-size: 16px;">Password:</td>
<td style="padding: 14px 20px; text-align: left; font-size: 16px;">${newPassword}</td>
</tr>
</table>
</div>
</div>



`;

// Send email to the admin
await send_adminEmail (admin.email, `Password Changed successfully ..!`, adminEmailContent);
await admin.save();

 return res.status(200).json({
         success : true ,
         message : 'Admin Password Changed Successfully'
 })
    } catch (error) {
        return res.status(500).json({
            success : false ,
            message : 'server error',
            error_message : error.message
        })
    }
 }

 
                    /* admin forget password */

                    function isValidEmail(email) {
                        // email validation
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        return emailRegex.test(email);
                    }
                
                    function generateOTP() {
                        const otp = Math.floor(1000 + Math.random() * 9000).toString();
                        return otp.slice(0, 4);
                    }
            
            // Api for opt generate
               const otpGenerate = async ( req , res )=> {
                   try {
                         const { email } = req.body
                         // check for email
                         if (!email || !isValidEmail(email)) {
                            return res.status(400).json({
                                success: false,
                                message: "Valid email is required"
                            });
                        }
                

                         // check for admin
                         const admin = await adminModel.findOne({ email : email })
                         if(!admin)
                         {
                               return res.status(400).json({
                                 success : false ,
                                 message : 'admin not found'
                               })
                         }

                         const otp = generateOTP();
    
                            // Save the OTP in the otpModel
                            const otpData = {
                                adminId : admin._id,
                                otp: otp
                            };
                            await adminOtp_Model.create(otpData);
                              const adminEmailContent = `<!DOCTYPE html>
                            <html lang="en">
                            <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <title>Forgot Password - Reset Your Password</title>
                            </head>
                            <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
                                <div style="width: 80%; max-width: 600px; margin: 40px auto; padding: 30px; background: #ffffff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                                    <section>
                                        <h2 style="color: #333; font-size: 24px; text-align: center; margin-bottom: 20px; font-weight: normal;">Dear ${admin.full_name}</h2>
                                        <p style="color: #666; font-size: 16px; text-align: center; margin-bottom: 20px; line-height: 1.5;">We received a request to reset your password. To proceed, please use the following One-Time Password (OTP):</p>
                                        <div style="background-color: #f9f9f9; text-align: center; padding: 20px; border-radius: 8px; margin: 0 auto 30px; max-width: 200px; border: 5px groove black;">
                                            <div style="font-size: 36px; font-weight: bold; color: #333; letter-spacing: 2px;">${otp}</div>
                                        </div>
                                        <p style="color: #666; font-size: 14px; text-align: center; margin-bottom: 20px;">This OTP will expire in 2 minutes.</p>
                                        <p style="color: #666; font-size: 16px; text-align: center; margin-bottom: 20px;">If you didn't request a password reset, you can ignore this email.</p>
                                        <p style="color: #666; font-size: 16px; text-align: center; margin-bottom: 20px;">Thank you!</p>
                                        <div style="text-align: center; margin-top: 40px; color: #999; font-size: 14px; border-top: 1px solid #e0e0e0; padding-top: 20px;">&copy; Smart Cloud Dimension. All rights reserved.</div>
                                    </section>
                                </div>
                            </body>
                            </html>
                            `
                            await send_adminEmail (admin.email, `OTP Email`, adminEmailContent);
                            await admin.save();

                               return res.status(200).json({
                                    success : true ,
                                    message : `An Otp has been send to your email`
                               })
                   } catch (error) {
                       return res.status(500).json({
                          success : false ,
                          message : 'server error',
                          error_message : error.message
                       })
                   }

               }

            // Api for otp verification
                   const verify_otp = async ( req , res )=> {
                     try {
                            const { otp } = req.body
                      // check for otp required
                      if(!otp)
                      { 
                          return res.status(400).json({
                                success : false ,
                                message : 'opt Required'
                          })
                      }

                      // check for otp

                      const check_otp = await adminOtp_Model.findOne({
                         otp : otp
                      })

                      if(!check_otp)
                      {
                          return res.status(400).json({
                             success : false ,
                             message : 'Invalid otp or expired'
                          })
                      }

                      return res.status(200).json({
                         success : true ,
                         message : 'OTP Verified Successfully',
                         adminId : otp.adminId
                      })

                     } catch (error) {
                          return res.status(500).json({
                              success : false ,
                              message : 'server error',
                              error_message : error.message
                          })
                     }
                   }
        
        // Api for recet password
                
                  const reset_password = async ( req , res )=> {
                      try {
                             const adminId = req.params.adminId
                             const { newPassword , confirmPassword } = req.body
                        
                             // check for required fileds
                             if(!adminId)
                             {
                                  return res.status(400).json({
                                     success : false ,
                                     message : 'adminId required'
                                  })
                             }

                             if(!newPassword)
                             {
                                 return res.status(400).json({
                                     success : false ,
                                     message : 'new Password required'
                                 })
                             }

                             if(!confirmPassword)
                             {
                                 return res.status(400).json({
                                     success : false ,
                                     message : 'confirm password required'
                                 })
                             }

                             // check for admin
                             const admin = await adminModel.findOne({ _id : adminId })
                             if(!admin)
                             {
                                 return res.status(400).json({
                                     success : false,
                                     message : 'Admin not found'
                                 })
                             }

                               // check for confirmPassword 
                                if(newPassword !== confirmPassword)
                                {
                                    return res.status(400).json({
                                         success : false ,
                                         message : 'confirm Password is not matched'
                                    })
                                }

                                // bcrypt the new password

                                const hashedNewPassword = await bcrypt.hash(newPassword , 10)
                                admin.password = hashedNewPassword
                                
                                
                                // check for otp
                              await adminOtp_Model.deleteOne({ adminId : adminId })
                            

                                const adminEmailContent = `<p style="text-align: center; font-size: 20px; color: #333; font-weight: 600; margin-bottom: 30px;">Congratulations! Your Password Has Been Reset</p>
                            <p style="text-align: center; font-size: 16px; color: #666; margin-bottom: 20px;">Here are your account details:</p>

                            <div style="display: flex; justify-content: center; align-items: center;">
                                <div style="width: auto; max-width: 500px; background-color: #f5f5f5; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1); padding: 20px;">
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <tr style="background-color: #fff;">
                                            <td style="padding: 14px 20px; text-align: left; font-weight: 600; font-size: 16px; border-bottom: 1px solid #e0e0e0;">Email:</td>
                                            <td style="padding: 14px 20px; text-align: left; font-size: 16px; border-bottom: 1px solid #e0e0e0;">${admin.email}</td>
                                        </tr>
                                        <tr style="background-color: #fff;">
                                            <td style="padding: 14px 20px; text-align: left; font-weight: 600; font-size: 16px;">Password:</td>
                                            <td style="padding: 14px 20px; text-align: left; font-size: 16px;">${newPassword}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                                        `

                    await send_adminEmail (admin.email, `Reset Password`, adminEmailContent);
                      await admin.save()
                     
                              return res.status(200).json({
                                 success : true ,
                                 message : 'Admin Password reset successfully'
                              })
                      } catch (error) {
                          return res.status(500).json({
                             success : false ,
                             message : 'server error',
                             error_message : error.message
                          })
                      }
                  }


                                                            /* Engineer Section */
        
        // Api for add Engineer

           const add_engineer = async( req , res)=> {
               try {
                      const { name , email , password , phone_no } = req.body
                      // check for required fields
                      const requiredFields = ['name' , 'email' , 'password' , 'phone_no']
                      for(let field of requiredFields)
                      {
                          if(!req.body[field])
                          {
                              return res.status(400).json({
                                 success : false ,
                                 message : `Required ${field.replace('_', ' ')}`
                              })
                          }
                      }


                      // check for already exist engineer

                      const exist_engg = await engineer_model.findOne({ phone_no , email  })
                      if(exist_engg)
                      {
                        return res.status(400).json({
                             success : false ,
                             message : 'Engineer Already exist'
                        })
                      }

                        // check for password
                        const hashedPassword = await bcrypt.hash(password , 10)

                         // Add engineer porfile
                         const profileImage = req.file.filename
                         const randomNumber = generateRandomNumber(4);
                         const Engineer_id = `ENGG-${randomNumber}`;
                 
                         // add new data
                         const newData = new engineer_model({
                             name ,
                             Engineer_id,
                             email ,
                             password : hashedPassword,
                             profileImage,
                             phone_no,
                             status : 1,
                            

                         })

                         await newData.save()
                                                        const emailContent = `<!DOCTYPE html>
                            <html lang="en">
                            <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                                <title>Your Credentials</title>
                                <style>
                                    body {
                                        font-family: Arial, sans-serif;
                                        background-color: #f0f0f0;
                                        margin: 0;
                                        padding: 0;
                                        display: flex;
                                        justify-content: center;
                                        padding: 50px; /* added padding for desktop */
                                    }
                                    .container {
                                        background-color: white;
                                        padding: 40px; /* increased padding for desktop view */
                                        border-radius: 10px;
                                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* increased shadow for desktop */
                                        width: 600px; /* wider for desktop */
                                        max-width: 80%; /* responsive to avoid overflow */
                                    }
                                    h2 {
                                        text-align: center;
                                        margin-bottom: 20px;
                                        color: #333;
                                    }
                                    p {
                                        color: #555;
                                    }
                                    .info-block {
                                        margin-bottom: 15px;
                                    }
                                    .info-block label {
                                        font-weight: bold;
                                        color: #333;
                                    }
                                    .info-block p {
                                        background-color: #f8f8f8;
                                        padding: 10px;
                                        border-radius: 5px;
                                        margin-top: 5px;
                                        word-wrap: break-word;
                                    }
                                    .footer {
                                        text-align: center;
                                        margin-top: 20px;
                                        font-size: 12px;
                                        color: #777;
                                    }
                                </style>
                            </head>
                            <body>

                            <div class="container">
                                <h2>Your Credentials</h2>
                                
                                <p>Dear Engineer,</p>
                                <p>We are pleased to share with you the credentials for accessing our system. Below are your login details:</p>
                                
                                <div class="info-block">
                                    <label>Email:</label>
                                    <p>${email}</p>
                                </div>

                                <div class="info-block">
                                    <label>Password:</label>
                                    <p>${password}</p>
                                </div>

                                <div class="info-block">
                                    <label>Engineer ID:</label>
                                    <p>${newData.Engineer_id}</p>
                                </div>

                                 <div class="info-block">
                                    <label>Phone No:</label>
                                    <p>${newData.phone_no}</p>
                                </div>
                                <p>We highly recommend updating your password upon first login to ensure the security of your account.</p>
                                
                                <div class="footer">
                                    <p>Best regards,<br>The Smart Cloud Dimension Team</p>
                                </div>
                            </div>

                            </body>
                            </html>
                                         `

                         await user_Email(email , 'Your Credentials for App Login' , emailContent)
                        
                          return res.status(200).json({
                             success : true ,
                             message : 'New Enginner Added Successfully'
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

    // Api for get all engineers 
    const get_all_engineers = async (req, res) => {
        try {
            // Fetch all engineers sorted by creation date
            const all_engg = await engineer_model.find({}).sort({ createdAt: -1 }).lean();
    
            if (!all_engg || all_engg.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No Engineer profile found'
                });
            }
    
            // Process each engineer
            const engineers_with_ratings = await Promise.all(
                all_engg.map(async (engineer) => {
                    // Fetch ratings for the current engineer
                    const ratings = await engineer_rating_model.find({ engineer_id: engineer.Engineer_id });
    
                    // Calculate the average rating
                    let avgRating = 0;
                    if (ratings.length > 0) {
                        const totalRating = ratings.reduce((acc, rating) => acc + rating.rating, 0);
                        avgRating = totalRating / ratings.length;
                    }
    
                    // Return the engineer details along with the average rating
                    return {
                        Engineer_id: engineer.Engineer_id,
                        Engineer_name: engineer.name,
                        Engineer_email: engineer.email,
                        Engineer_phoneNo: engineer.phone_no,
                        Engineer_password: engineer.password,
                        Engineer_status: engineer.status,
                        Engineer_profile: engineer.profileImage,
                        Engineer_rating: avgRating.toFixed(1), 
                    };
                })
            );
    
            // Send response with all engineers and their ratings
            return res.status(200).json({
                success: true,
                message: 'ALL Engineers',
                Details: engineers_with_ratings
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error_message: error.message
            });
        }
    };
    

       // Api for get particular engineer profile
          const get_Engineer = async( req , res )=> {
                   try {
                             const engg_id = req.params.engg_id
                        // check for engg_id
                        if(!engg_id)
                        {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'Engineer Id Required'
                            })
                        }

                        // check for Engineer

                        const Engineer = await engineer_model.findOne({ Engineer_id : engg_id })
                        if(!Engineer)
                        {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'Engineer Not Found'
                            })
                        }

                         // Fetch the ratings for the engineer
                        const ratings = await engineer_rating_model.find({ engineer_id: engg_id });

                        // Calculate the average rating
                        let avgRating = 0;
                        if (ratings.length > 0) {
                            const totalRating = ratings.reduce((acc, rating) => acc + rating.rating, 0);
                            avgRating = totalRating / ratings.length;
                        }

                        return res.status(200).json({
                             success : true,
                             message : 'Enginner Details',
                             Detail : {
                                rating : avgRating,
                                _id : Engineer._id,
                                name : Engineer.name,
                                Engineer_id : Engineer.Engineer_id,
                                email : Engineer.email,
                                phone_no : Engineer.phone_no,
                                profileImage : Engineer.profileImage,
                                status : Engineer.status
                             }
                        })
                   } catch (error) {
                       return res.status(500).json({
                         success : false ,
                         message : 'Server error',
                         error_message : error.message
                       })
                   }
          }

        // Delete particlar engineer

        const deleteEngg = async (req, res) => {
            try {
              const Engineer_id = req.params.Engineer_id;
          
              // Check if Engineer_id is provided
              if (!Engineer_id) {
                return res.status(400).json({
                  success: false,
                  message: 'Engineer Id required',
                });
              }
          
              // Check if Engineer exists
              const Engg = await engineer_model.findOne({ Engineer_id });
              if (!Engg) {
                return res.status(400).json({
                  success: false,
                  message: 'Engineer does not exist',
                });
              }
          
              // Check if the engineer has any assigned tasks
              const assignedTasks = await enginner_assign_enq_model.find({ engineer_id : Engineer_id });
              
              // Loop through each task and check enquiry status
              for (const task of assignedTasks) {
                const enq_no = task.Enq_no;  
                const enquiry = await cus_enq_Model.findOne({ Enq_no : enq_no });
          
                // If any enquiry has a status of "Pending", stop the deletion
                if (enquiry && enquiry.status === 'Pending') {
                  return res.status(400).json({
                    success: false,
                    message: `Cannot delete the Engineer. Engineer has pending enquiry with enq_no: ${enq_no}`,
                  });
                }
              }
          
              // No pending enquiries, delete the engineer
              await Engg.deleteOne();
          
              return res.status(200).json({
                success: true,
                message: 'Engineer profile deleted successfully',
              });
            } catch (error) {
              return res.status(500).json({
                success: false,
                message: 'Server error',
                error_message: error.message,
              });
            }
          };
          


                                                           /* Services Section */

        // Api for add Service
         const add_service = async ( req , res)=> {
               try {
                      const { service_name , service_price , service_description } = req.body
                      
                      // check for required field
                      if(!service_name)
                      {
                        return res.status(400).json({
                             success : false ,
                             message : 'Service Name Required'
                        })
                      }
                      if(!service_price)
                      {
                        return res.status(400).json({
                             success : false ,
                             message : 'Service price Required'
                        })
                      }
                      if(!service_description)
                      {
                        return res.status(400).json({
                             success : false ,
                             message : 'Service Description Required'
                        })
                      }

                      // check for already exist service
                      const exist_service = await services_model.findOne({ service_name })
                      if(exist_service)

                        {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'Service Already Exist'
                            })
                        }

                        const icon = req.file.filename
                        // add new service
                         const new_service = new services_model({
                            service_name , service_price , service_description , service_icon : icon
                         })
                         await new_service.save()

                         return res.status(200).json({
                              success : true ,
                              message : 'New Service Added Successfully'
                         })

               } catch (error) {
                  return res.status(500).json({
                      success : false ,
                      message : 'Server error',
                      error_message : error.message
                  })
               }
         }


         // Api for get all Services

           const get_services = async ( req , res)=> {
                try {
                        // check for all services
                        
                        const all_services = await services_model.find({ }).sort({ createdAt : -1 }).lean()
                        if(!all_services)
                        {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'No Services Found'
                            })
                        }

                        

                        return res.status(200).json({
                             success : true,
                             message : 'All Services',
                             all_services : all_services.map((s)=> ({
                                      service_name : s.service_name,
                                      service_price : s.service_price,
                                      service_description : s.service_description,
                                      service_icon : s.service_icon || '',
                                      service_id : s._id
                             }))
                        })
                } catch (error) {
                      return res.status(500).json({
                         success : false ,
                         message : 'Server error',
                         error_message : error.message
                      })
                }
           }

           // Api for update services
               const update_service = async ( req , res )=> {
                    try {
                            const service_id = req.params.service_id
                            const { service_name , service_price , service_description } = req.body


                            // check for service_id
                            if(!service_id)
                            {
                                return res.status(400).json({
                                      success : false ,
                                      message : 'Service Id Required'
                                })
                            }

                            // check for service
                            const service = await services_model.findOne({ _id : service_id })

                            if(!service)
                            {
                                return res.status(400).json({
                                       success : false ,
                                       message : 'Service Not Found'
                                })
                            }
                                     if(service_name)
                                        {
                                            service.service_name = service_name
                                        }   
                            
                                     if(service_price)
                                        {
                                            service.service_price = service_price
                                        }   
                            
                                     if(service_description)
                                        {
                                            service.service_description = service_description
                                        }  
                                        
                                        if(req.file)
                                        {
                                            service.service_icon = req.file.filename
                                        }
                                       
                                        await service.save()

                                        return res.status(200).json({
                                              success : true ,
                                              message : 'Service Update Successfully'
                                        })
                    } catch (error) {
                          return res.status(500).json({
                               success : false ,
                               message : 'Server error',
                               error_message : error.message
                          })
                    }
               }

        // Api for delete Service
        const delete_service = async (req, res) => {
            try {
              const service_id = req.params.service_id;
          
              // Check for service_id
              if (!service_id) {
                return res.status(400).json({
                  success: false,
                  message: 'Service Id Required',
                });
              }
          
              // Check for service
              const service = await services_model.findOne({ _id: service_id });
              if (!service) {
                return res.status(400).json({
                  success: false,
                  message: 'Service Not Found',
                });
              }
          
              // Check if any pending customer enquiries exist for the service
              const check_service_enq = await cus_enq_Model.find({
                'services.service_id': service_id,
                status: { $ne: 'Confirmed' },
              });
          
              if (check_service_enq.length > 0) {
                return res.status(400).json({
                  success: false,
                  message: 'You cannot delete the service as customers have pending enquiries.',
                });
              }
          
              await service.deleteOne();
          
              return res.status(200).json({
                success: true,
                message: 'Service Deleted Successfully',
              });
            } catch (error) {
              return res.status(500).json({
                success: false,
                message: 'Server error',
                error_message: error.message,
              });
            }
          };
          
                                                                    /* Customer section */
         // Api for get all Customer

         const get_all_Customer = async( req , res)=> {
            try {
                      // check for all Customer

                      const all_Cus = await customer_Model.find({}).sort({ createdAt : -1 }).lean()

                      if(!all_Cus)
                      {
                          return res.status(400).json({
                               success : false ,
                               message : 'No Customer profile found'
                          })
                      }

                      return res.status(200).json({
                           success : true ,
                           message : 'ALL Customer',
                           Details : all_Cus.map((e)=> ({
                                 customer_id  : e.customer_id,
                                 customer_name : e.name,
                                 customer_email : e.email,
                                 customer_phoneNo : e.phone_no,                                
                                 customer_status : e.status,
                                 customer_profile : e.profileImage,
                                 customer_address : e.address
                           }))
                      })
            } catch (error) {
                 return res.status(500).json({
                    success : false ,
                    message : 'Server error',
                    error_message : error.message
                 })
            }
     }


     // Api for Admin Dashboard
                const admin_dashboard = async( req , res)=> {
                     try {
                               // check for all customer
                               const customer = await customer_Model.find()
                               // check for all Engg
                               const engg = await engineer_model.find()
                               // check for all service
                               const service = await services_model.find()
                               // check for all_enq
                               const all_enq = await cus_enq_Model.find()
                               // check for all pending enq
                               const all_pending_enq = await cus_enq_Model.find({ status : 'Pending'})
                               // check for all Confirmed Enq
                               const all_confirmed_enq = await cus_enq_Model.find({ status : 'Confirmed'})
                                // check for all cancelled Enq
                                const all_cancelled_enq = await cus_enq_Model.find({ status : 'Cancelled'})

                                return res.status(200).json({
                                     success : true ,
                                     message : 'Dashboard Count',
                                     all_customer : customer.length,
                                     all_Engineer : engg.length,
                                     all_Service : service.length,
                                     all_Enquiry :  all_enq.length,
                                     all_pending_enquiry : all_pending_enq.length,
                                     all_confirmed_enquiry : all_confirmed_enq.length,
                                     all_cancelled_enquiry : all_cancelled_enq.length,
                                })
                     } catch (error) {
                          return res.status(500).json({
                             success : false ,
                             message : 'Server error',
                             error_message : error.message
                          })
                     }
                }


                                                                 /*  customer Enquiry Model */

        // Api for get all Enquiry for the service
        const get_all_enquiry = async (req, res) => {
            try {
                const status = req.query.status;
        
                // Fetch all user enquiries, sorted by creation date (latest first)
                const all_enq = await cus_enq_Model.find({}).sort({ createdAt: -1 }).lean();
                if (!all_enq || all_enq.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'No Enquiry Received Yet',
                    });
                }
        
                // Apply status filter if provided, otherwise return all enquiries
                let filteredEnq = all_enq;
                if (status) {
                    const validStatuses = ["Pending", "Confirmed", "Cancelled"];
                    if (validStatuses.includes(status)) {
                        filteredEnq = all_enq.filter(e => e.status === status);
                    } else {
                        return res.status(400).json({
                            success: false,
                            message: "Invalid status value",
                        });
                    }
                }
        
                return res.status(200).json({
                    success: true,
                    message: 'All Enquiries',
                    enquiries: filteredEnq,
                });
        
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error_message: error.message,
                });
            }
        };
        

        // Api for assign enquiry to engineer
        const assing_enqRequest_to_engineer = async (req, res) => {
            try {
                const enq_id = req.params.enq_id;
                const engineer_id = req.body.engineer_id;
        
                // Check for enq_id
                if (!enq_id) {
                    return res.status(400).json({
                        success: false,
                        message: 'Inquiry Id Required'
                    });
                }
        
                // Check for Enquiry
                const Enq = await cus_enq_Model.findOne({ _id: enq_id });
                if (!Enq) {
                    return res.status(400).json({
                        success: false,
                        message: 'No Inquiry found'
                    });
                }
        
                // Check for engineer id
                if (!engineer_id) {
                    return res.status(400).json({
                        success: false,
                        message: 'Engineer Id required'
                    });
                }
        
                // Check for engineer
                const engg = await engineer_model.findOne({ Engineer_id: engineer_id });
                if (!engg) {
                    return res.status(400).json({
                        success: false,
                        message: 'Engineer Not exist'
                    });
                }
        
                // Check for assigned enquiry
                const exist_assign_enq = await enginner_assign_enq_model.findOne({ Enq_no: Enq.Enq_no });
                if (exist_assign_enq) {
                    return res.status(400).json({
                        success: false,
                        message: `Enquiry Already Assigned To Engineer: ${engg.Engineer_id}`
                    });
                }
        
                // Access bill according to enquiry number
                const bill = await cus_bill_Model.findOne({
                    Enq_no: Enq.Enq_no
                });
        
                // Concatenate service names for email
                const serviceNames = Enq.services.map(service => service.service_name).join(', ');
        
                // Assign enquiry to engineer
                const assign_enq = new enginner_assign_enq_model({
                    customer_id: Enq.customer_id,
                    Enq_no: Enq.Enq_no,
                    engineer_id: engineer_id,
                    engineer_name: engg.name,
                    Bill: {
                        customer_name: bill.cus_name,
                        bill_id: bill._id,
                        bill_no: bill.bill_no,
                        services: bill.services,
                        bill_status: bill.bill_status,
                        total_Bill: bill.total_bill_amount,
                    }
                });
        
                await assign_enq.save();
                Enq.status = 'Assigned';
                await Enq.save();
        
                // Updated email content to include all service names
                const emailContent = `
                <!DOCTYPE html>
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
                        <p style="font-size: 16px; line-height: 1.8; color: #4a4a4a;">Dear <strong>${Enq.customer_name}</strong>,</p>
                        <p style="font-size: 16px; line-height: 1.8; color: #4a4a4a;">We are pleased to confirm that your request regarding our <span style="font-weight: bold; color: #004b8d;">${serviceNames}</span> service has been successfully received.</p>
                        <div style="background-color: #f1f3f4; padding: 15px; border-radius: 6px; margin-bottom: 20px; color: #333;">
                            Your Inquiry Number: <span style="font-weight: bold; color: #004b8d;">${Enq.Enq_no}</span>
                        </div>
                        <p style="font-size: 16px; line-height: 1.8; color: #4a4a4a;">Your request is confirmed, and our team will begin working on it soon. One of our engineers will be in contact with you in a few days to discuss the next steps and provide any additional information you may need.</p>
                        <p style="font-size: 16px; line-height: 1.8; color: #4a4a4a;">Here are the contact details of the assigned engineer:</p>
                        
                        <ul style="font-size: 16px; line-height: 1.8; color: #4a4a4a;">
                            <li><strong>Engineer Name:</strong> ${engg.name}</li>
                            <li><strong>Email:</strong> <a href="mailto:${engg.email}" style="color: #004b8d; text-decoration: none;">${engg.email}</a></li>
                            <li><strong>Phone:</strong> ${engg.phone_no}</li>
                        </ul>
                        <p style="font-size: 16px; line-height: 1.8; color: #4a4a4a;">Our team is dedicated to addressing your request as soon as possible. If you have any immediate questions, feel free to contact the engineer directly or reply to this email.</p>
                        <p style="margin-top: 30px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                            Best regards,<br>                       
                            Smart Cloud Dimension
                        </p>
                        <a href="mailto:Sales@smartclouddimensions.net" style="display: inline-block; padding: 12px 24px; margin-top: 20px; background-color: #004b8d; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">Contact Us</a>
                        <div style="text-align: center; font-size: 13px; color: #888; margin-top: 40px; border-top: 1px solid #e3e6e8; padding-top: 15px;">
                            <p>If you need further assistance, feel free to reach out to us at <a href="mailto:Sales@smartclouddimensions.net" style="color: #004b8d; text-decoration: none;">Sales@smartclouddimensions.net</a></p>
                            <p>&copy; Smart Cloud Dimension. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                `;
        
                await user_Email(Enq.customer_email, 'Enquiry Email', emailContent);
        
                return res.status(200).json({
                    success: true,
                    message: 'Inquiry Assigned To Engineer Successfully'
                });
        
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error_message: error.message
                });
            }
        }
        
                       

                                                                /* Report Section */

        const export_engineer = async (req, res) => {
            try {
                     // Fetch Engineer 
                const Engg = await engineer_model.find({  });                  
        
                // Create Excel workbook and worksheet
                const workbook = new ExcelJs.Workbook();
                const worksheet = workbook.addWorksheet("Engg");
        
                // Define the Excel Header
                worksheet.columns = [
                    {
                        header: "Engineer Id",
                        key: "Engineer_id",
                    },
                    {
                        header: "Engineer Name",
                        key: "name",
                    },
                    {
                        header: "Engineer Email",
                        key: "email",
                    },
                    {
                        header: "Phone Number",
                        key: "phone_no",
                    },
                    {
                        header: "Profile",
                        key: "profileImage",
                    },
                    {
                        header: "password",
                        key: "password",
                    },
                    {
                        header: "status",
                        key: "status",
                    },
                    
                ];
        
                // Add Engineer to worksheet
                Engg.forEach((Engg) => {
                    worksheet.addRow({
                        Engineer_id: Engg.Engineer_id,
                        name: Engg.name,
                        email: Engg.email,                       
                        phone_no: Engg.phone_no,
                        profileImage: Engg.profileImage,
                        password: Engg.password,
                        status : Engg.status
                       
                    });
                });
        
                // Set response headers for downloading the Excel file
                res.setHeader(
                    "Content-Type",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                );
        
                res.setHeader("Content-Disposition", `attachment; filename=Engineers.xlsx`);
        
                // Generate and send the Excel File as a response
                await workbook.xlsx.write(res);
        
                // End the response
                res.end();
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "server error" });
            }
        };

         // Api for export customer
          
         const export_customer = async (req, res) => {
            try {
                     // Fetch Customer 
                const customer = await customer_Model.find({  });                  
        
                // Create Excel workbook and worksheet
                const workbook = new ExcelJs.Workbook();
                const worksheet = workbook.addWorksheet("customer");
        
                // Define the Excel Header
                worksheet.columns = [
                    {
                        header: "Customer Id",
                        key: "customer_id",
                    },   
                             
                    {
                        header: "Customer Name",
                        key: "name",
                    },
                    {
                        header: "Customer Email",
                        key: "email",
                    },
                    {
                        header: "Phone Number",
                        key: "phone_no",
                    },
                    {
                        header: "Address",
                        key: "address",
                    },
                    {
                        header: "Profile",
                        key: "profileImage",
                    },
                    {
                        header: "password",
                        key: "password",
                    },
                    {
                        header: "status",
                        key: "status",
                    },
                    
                ];
                            

                // Add Customer to worksheet
                customer.forEach((customer) => {
                    worksheet.addRow({
                        customer_id: customer.customer_id,
                        name: customer.name,
                        email: customer.email,                       
                        phone_no: customer.phone_no,
                        profileImage: customer.profileImage,
                        address : customer.address,
                        password: customer.password,
                        status : customer.status
                       
                    });
                });
        
                // Set response headers for downloading the Excel file
                res.setHeader(
                    "Content-Type",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                );
        
                res.setHeader("Content-Disposition", `attachment; filename=customers.xlsx`);
        
                // Generate and send the Excel File as a response
                await workbook.xlsx.write(res);
        
                // End the response
                res.end();
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "server error" });
            }
        };

        
        // Api for export enquiry 
  
        const all_enquiry_export = async (req, res) => {
            try {
                const { startDate, endDate } = req.query;
        
                // Set default start and end dates to today if not provided
                const start = startDate ? new Date(startDate) : new Date(new Date().setHours(0, 0, 0, 0));
                const end = endDate ? new Date(endDate) : new Date(new Date().setHours(23, 59, 59, 999));
        
                // Create a filter object for date range
                let dateFilter = {};
                if (start && end) {
                    dateFilter = { createdAt: { $gte: start, $lte: end } };
                } else if (start) {
                    dateFilter = { createdAt: { $gte: start } };
                } else if (end) {
                    dateFilter = { createdAt: { $lte: end } };
                }
        
                // Debug: Log the date filter
                console.log("Date Filter:", dateFilter);
        
                // Fetch Customer Enquiry with date filter
                const customer_enq = await cus_enq_Model.find(dateFilter);
        
                // Create Excel workbook and worksheet
                const workbook = new ExcelJs.Workbook();
                const worksheet = workbook.addWorksheet("customer_enq");
        
                // Define the Excel Header
                worksheet.columns = [
                    { header: "Customer Id", key: "customer_id" },
                    { header: "Customer Name", key: "customer_name" },
                    { header: "Customer Email", key: "customer_email" },
                    { header: "Phone Number", key: "customer_phone_no" },
                    { header: "Service Name", key: "service_names" },
                    { header: "Enquiry Number", key: "Enq_no" },
                    { header: "Subject", key: "subject" },
                    { header: "Message", key: "message" },
                    { header: "Status", key: "status" },
                ];
        
                customer_enq.forEach((enq) => {
                    const serviceNames = enq.services.map(service => service.service_name).join(', ');
        
                    worksheet.addRow({
                        customer_id: enq.customer_id,
                        customer_name: enq.customer_name,
                        customer_email: enq.customer_email,
                        customer_phone_no: enq.customer_phone_no,
                        customer_address: enq.customer_address,
                        service_names: serviceNames,
                        Enq_no: enq.Enq_no,
                        subject: enq.subject,
                        message: enq.message,
                        status: enq.status,
                    });
                });
        
                // Set response headers for downloading the Excel file
                res.setHeader(
                    "Content-Type",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                );
                res.setHeader(
                    "Content-Disposition",
                    `attachment; filename=customer_Enquiry.xlsx`
                );
        
                // Generate and send the Excel File as a response
                await workbook.xlsx.write(res);
                res.end();
            } catch (error) {
                console.error("Error exporting enquiries:", error);
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error_message: error.message
                });
            }
        };
        


        // Api for get partiuclar enq details
         
        const get_particular_enq_detail = async (req, res) => {
            try {
                const { enq_id } = req.params; 
        
                // Check for enq_id
                if (!enq_id) {
                    return res.status(400).json({
                        success: false,
                        message: 'Inquiry ID required'
                    });
                }
        
                // Check for Inquiry
                const inquiry = await cus_enq_Model.findOne({ _id: enq_id });
        
                if (!inquiry) {
                    return res.status(404).json({
                        success: false,
                        message: 'Inquiry not found'
                    });
                }
        
                return res.status(200).json({
                    success: true,
                    message: 'Inquiry details retrieved successfully',
                    detail: inquiry 
                });
            } catch (error) {
                console.error(error); 
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error_message: error.message
                });
            }
        };
        
                                                          /* CMS Section  */

    // Api for cms_home_why_you_choose_services_Model
          const cms_home_why_you_choose_services = async( req , res )=> {
                try {
                      const { Heading , Description } = req.body
                      // check for exist details
                         const exist_detail = await cms_home_why_you_choose_services_Model.findOne({ })
                         if(exist_detail)
                         {
                                exist_detail.Heading = Heading
                                exist_detail.Description = Description

                                await exist_detail.save()
                                return res.status(200).json({
                                       success : true ,
                                       message : 'Details Updated Successfully'
                                })
                         }

                         else
                         {
                               // check for required fields
                                
                               if(!Heading)
                               {
                                return res.status(400).json({
                                       success : false ,
                                       message : 'Heading Required'
                                })
                               }

                               if(!Description)
                               {
                                return res.status(400).json({
                                       success : false ,
                                       message : 'Description Required'
                                })
                               }

                               // create new data
                               const new_data = new cms_home_why_you_choose_services_Model({
                                      Heading,
                                      Description
                               })
                               await new_data.save()

                               return res.status(200).json({
                                     success : true ,
                                     message : 'New Details added Successfully'
                               })

                         }
                } catch (error) {
                     return res.status(500).json({
                           success : false ,
                           message : 'Server error',
                           error_message : error.message
                     })
                }
          }

  // Api for get details of cms_home_why_you_choose_services

                   const get_cms_home_why_you_choose_services = async( req , res )=> {
                        try {
                                    // check for details
                                    const get_details = await cms_home_why_you_choose_services_Model.findOne({ })
                                    if(!get_details)
                                    {
                                        return res.status(400).json({
                                              success : false ,
                                              message : 'No Details found'
                                        })
                                    }

                                    return res.status(200).json({
                                          success : true ,
                                          message : 'cms home why you choose services Details',
                                          Details : {
                                            Heading : get_details.Heading,
                                            Description : get_details.Description,
                                            Id : get_details._id
                                          }
                                    })
                        } catch (error) {
                            return res.status(500).json({
                                success : false ,
                                message : 'Server error',
                                error_message : error.message
                          })
                        }
                   }


    // Api for cms_home_service_smart_servelliance_system

    const cms_home_service_smart_servelliance_system = async( req , res )=> {
        try {
              const { Heading , Description } = req.body
              // check for exist details
                 const exist_detail = await cms_home_service_smart_servelliance_system_Model.findOne({ })
                 if(exist_detail)
                 {
                        exist_detail.Heading = Heading
                        exist_detail.Description = Description
                        if(req.file)
                        {
                              exist_detail.image = req.file.filename
                        }

                        await exist_detail.save()
                        return res.status(200).json({
                               success : true ,
                               message : 'Details Updated Successfully'
                        })
                 }

                 else
                 {
                       // check for required fields
                        
                       if(!Heading)
                       {
                        return res.status(400).json({
                               success : false ,
                               message : 'Heading Required'
                        })
                       }

                       if(!Description)
                       {
                        return res.status(400).json({
                               success : false ,
                               message : 'Description Required'
                        })
                       }

                            const image = req.file.filename
                       // create new data
                       const new_data = new cms_home_service_smart_servelliance_system_Model({
                              Heading,
                              Description,
                              image 
                       })
                       await new_data.save()

                       return res.status(200).json({
                             success : true ,
                             message : 'New Details added Successfully'
                       })

                 }
        } catch (error) {
             return res.status(500).json({
                   success : false ,
                   message : 'Server error',
                   error_message : error.message
             })
        }
  }


  // Api for get cms_home_service_smart_servelliance_system
  const get_cms_home_service_smart_servelliance_system = async( req , res )=> {
    try {
                // check for details
                const get_details = await cms_home_service_smart_servelliance_system_Model.findOne({ })
                if(!get_details)
                {
                    return res.status(400).json({
                          success : false ,
                          message : 'No Details found'
                    })
                }

                return res.status(200).json({
                      success : true ,
                      message : 'smart servelliance system Details',
                      Details : {
                        Heading : get_details.Heading,
                        Description : get_details.Description,
                        image : get_details.image,
                        Id : get_details._id
                      }
                })
    } catch (error) {
        return res.status(500).json({
            success : false ,
            message : 'Server error',
            error_message : error.message
      })
    }
}


   // Api for smart attendence system
           

    const cms_home_service_smart_attandence_system = async( req , res )=> {
        try {
              const { Heading , Description } = req.body
              // check for exist details
                 const exist_detail = await cms_home_service_smart_attendence_system_Model.findOne({ })
                 if(exist_detail)
                 {
                        exist_detail.Heading = Heading
                        exist_detail.Description = Description
                        if(req.file)
                        {
                              exist_detail.image = req.file.filename
                        }

                        await exist_detail.save()
                        return res.status(200).json({
                               success : true ,
                               message : 'Details Updated Successfully'
                        })
                 }

                 else
                 {
                       // check for required fields
                        
                       if(!Heading)
                       {
                        return res.status(400).json({
                               success : false ,
                               message : 'Heading Required'
                        })
                       }

                       if(!Description)
                       {
                        return res.status(400).json({
                               success : false ,
                               message : 'Description Required'
                        })
                       }

                            const image = req.file.filename
                       // create new data
                       const new_data = new cms_home_service_smart_attendence_system_Model({
                              Heading,
                              Description,
                              image 
                       })
                       await new_data.save()

                       return res.status(200).json({
                             success : true ,
                             message : 'New Details added Successfully'
                       })

                 }
        } catch (error) {
             return res.status(500).json({
                   success : false ,
                   message : 'Server error',
                   error_message : error.message
             })
        }
  }

  const get_cms_home_service_smart_attendence_system = async( req , res )=> {
    try {
                // check for details
                const get_details = await cms_home_service_smart_attendence_system_Model.findOne({ })
                if(!get_details)
                {
                    return res.status(400).json({
                          success : false ,
                          message : 'No Details found'
                    })
                }

                return res.status(200).json({
                      success : true ,
                      message : 'smart Attendance system Details',
                      Details : {
                        Heading : get_details.Heading,
                        Description : get_details.Description,
                        image : get_details.image,
                        Id : get_details._id
                      }
                })
    } catch (error) {
        return res.status(500).json({
            success : false ,
            message : 'Server error',
            error_message : error.message
      })
    }
}


 // Api for smart Access  system
           

 const cms_home_service_smart_Access_system = async( req , res )=> {
    try {
          const { Heading , Description } = req.body
          // check for exist details
             const exist_detail = await cms_home_service_smart_Access_system_Model.findOne({ })
             if(exist_detail)
             {
                    exist_detail.Heading = Heading
                    exist_detail.Description = Description
                    if(req.file)
                    {
                          exist_detail.image = req.file.filename
                    }

                    await exist_detail.save()
                    return res.status(200).json({
                           success : true ,
                           message : 'Details Updated Successfully'
                    })
             }

             else
             {
                   // check for required fields
                    
                   if(!Heading)
                   {
                    return res.status(400).json({
                           success : false ,
                           message : 'Heading Required'
                    })
                   }

                   if(!Description)
                   {
                    return res.status(400).json({
                           success : false ,
                           message : 'Description Required'
                    })
                   }

                        const image = req.file.filename
                   // create new data
                   const new_data = new cms_home_service_smart_Access_system_Model({
                          Heading,
                          Description,
                          image 
                   })
                   await new_data.save()

                   return res.status(200).json({
                         success : true ,
                         message : 'New Details added Successfully'
                   })

             }
    } catch (error) {
         return res.status(500).json({
               success : false ,
               message : 'Server error',
               error_message : error.message
         })
    }
}




// Api for cms_home_service_smart_Access_system
const get_cms_home_service_smart_Access_system = async( req , res )=> {
    try {
                // check for details
                const get_details = await cms_home_service_smart_Access_system_Model.findOne({ })
                if(!get_details)
                {
                    return res.status(400).json({
                          success : false ,
                          message : 'No Details found'
                    })
                }

                return res.status(200).json({
                      success : true ,
                      message : 'smart Access System Details',
                      Details : {
                        Heading : get_details.Heading,
                        Description : get_details.Description,
                        image : get_details.image,
                        Id : get_details._id
                      }
                })
    } catch (error) {
        return res.status(500).json({
            success : false ,
            message : 'Server error',
            error_message : error.message
      })
    }
}

const cms_home_service_smart_office_system = async( req , res )=> {
    try {
          const { Heading , Description } = req.body
          // check for exist details
             const exist_detail = await cms_home_service_smart_office_system_Model.findOne({ })
             if(exist_detail)
             {
                    exist_detail.Heading = Heading
                    exist_detail.Description = Description
                    if(req.file)
                    {
                          exist_detail.image = req.file.filename
                    }

                    await exist_detail.save()
                    return res.status(200).json({
                           success : true ,
                           message : 'Details Updated Successfully'
                    })
             }

             else
             {
                   // check for required fields
                    
                   if(!Heading)
                   {
                    return res.status(400).json({
                           success : false ,
                           message : 'Heading Required'
                    })
                   }

                   if(!Description)
                   {
                    return res.status(400).json({
                           success : false ,
                           message : 'Description Required'
                    })
                   }

                        const image = req.file.filename
                   // create new data
                   const new_data = new cms_home_service_smart_office_system_Model({
                          Heading,
                          Description,
                          image 
                   })
                   await new_data.save()

                   return res.status(200).json({
                         success : true ,
                         message : 'New Details added Successfully'
                   })

             }
    } catch (error) {
         return res.status(500).json({
               success : false ,
               message : 'Server error',
               error_message : error.message
         })
    }
}


// Api for cms_home_service_smart_office_system
const get_cms_home_service_smart_office_system = async( req , res )=> {
    try {
                // check for details
                const get_details = await cms_home_service_smart_office_system_Model.findOne({ })
                if(!get_details)
                {
                    return res.status(400).json({
                          success : false ,
                          message : 'No Details found'
                    })
                }

                return res.status(200).json({
                      success : true ,
                      message : 'smart Office System Details',
                      Details : {
                        Heading : get_details.Heading,
                        Description : get_details.Description,
                        image : get_details.image,
                        Id : get_details._id
                      }
                })
    } catch (error) {
        return res.status(500).json({
            success : false ,
            message : 'Server error',
            error_message : error.message
      })
    }
}


const cms_home_service_smart_security_system = async( req , res )=> {
    try {
          const { Heading , Description } = req.body
          // check for exist details
             const exist_detail = await cms_home_service_smart_security_system_Model.findOne({ })
             if(exist_detail)
             {
                    exist_detail.Heading = Heading
                    exist_detail.Description = Description
                    if(req.file)
                    {
                          exist_detail.image = req.file.filename
                    }

                    await exist_detail.save()
                    return res.status(200).json({
                           success : true ,
                           message : 'Details Updated Successfully'
                    })
             }

             else
             {
                   // check for required fields
                    
                   if(!Heading)
                   {
                    return res.status(400).json({
                           success : false ,
                           message : 'Heading Required'
                    })
                   }

                   if(!Description)
                   {
                    return res.status(400).json({
                           success : false ,
                           message : 'Description Required'
                    })
                   }

                        const image = req.file.filename
                   // create new data
                   const new_data = new cms_home_service_smart_security_system_Model({
                          Heading,
                          Description,
                          image 
                   })
                   await new_data.save()

                   return res.status(200).json({
                         success : true ,
                         message : 'New Details added Successfully'
                   })

             }
    } catch (error) {
         return res.status(500).json({
               success : false ,
               message : 'Server error',
               error_message : error.message
         })
    }
}


// Api for get cms home service smart security system
    
const get_cms_home_service_smart_security_system = async( req , res )=> {
    try {
                // check for details
                const get_details = await cms_home_service_smart_security_system_Model.findOne({ })
                if(!get_details)
                {
                    return res.status(400).json({
                          success : false ,
                          message : 'No Details found'
                    })
                }

                return res.status(200).json({
                      success : true ,
                      message : 'smart Security System Details',
                      Details : {
                        Heading : get_details.Heading,
                        Description : get_details.Description,
                        image : get_details.image,
                        Id : get_details._id
                      }
                })
    } catch (error) {
        return res.status(500).json({
            success : false ,
            message : 'Server error',
            error_message : error.message
      })
    }
}


const cms_home_service_smart_home_system = async( req , res )=> {
    try {
          const { Heading , Description } = req.body
          // check for exist details
             const exist_detail = await cms_home_service_smart_home_system_Model.findOne({ })
             if(exist_detail)
             {
                    exist_detail.Heading = Heading
                    exist_detail.Description = Description
                    if(req.file)
                    {
                          exist_detail.image = req.file.filename
                    }

                    await exist_detail.save()
                    return res.status(200).json({
                           success : true ,
                           message : 'Details Updated Successfully'
                    })
             }

             else
             {
                   // check for required fields
                    
                   if(!Heading)
                   {
                    return res.status(400).json({
                           success : false ,
                           message : 'Heading Required'
                    })
                   }

                   if(!Description)
                   {
                    return res.status(400).json({
                           success : false ,
                           message : 'Description Required'
                    })
                   }

                        const image = req.file.filename
                   // create new data
                   const new_data = new cms_home_service_smart_home_system_Model({
                          Heading,
                          Description,
                          image 
                   })
                   await new_data.save()

                   return res.status(200).json({
                         success : true ,
                         message : 'New Details added Successfully'
                   })

             }
    } catch (error) {
         return res.status(500).json({
               success : false ,
               message : 'Server error',
               error_message : error.message
         })
    }
}


const get_cms_home_service_smart_home_system = async( req , res )=> {
    try {
                // check for details
                const get_details = await cms_home_service_smart_home_system_Model.findOne({ })
                if(!get_details)
                {
                    return res.status(400).json({
                          success : false ,
                          message : 'No Details found'
                    })
                }

                return res.status(200).json({
                      success : true ,
                      message : 'smart Security Home Details',
                      Details : {
                        Heading : get_details.Heading,
                        Description : get_details.Description,
                        image : get_details.image,
                        Id : get_details._id
                      }
                })
    } catch (error) {
        return res.status(500).json({
            success : false ,
            message : 'Server error',
            error_message : error.message
      })
    }
}
  

const cms_contact_us_details = async( req , res )=> {
    try {
          const { Heading , Description , mail_at , mail ,
            call_us_on , call , our_address , address , time_schedule ,
            time
           } = req.body
          // check for exist details
             const exist_detail = await cms_contact_us_details_model.findOne({ })
             if(exist_detail)
             {
                    exist_detail.Heading = Heading
                    exist_detail.Description = Description
                   
                    exist_detail.mail_at = mail_at
                    exist_detail.mail = mail
                    
                    exist_detail.call_us_on = call_us_on
                    exist_detail.call = call
                   
                    exist_detail.our_address = our_address
                    exist_detail.address = address

                    exist_detail.time_schedule = time_schedule
                    exist_detail.time = time

                    await exist_detail.save()
                    return res.status(200).json({
                           success : true ,
                           message : 'Details Updated Successfully'
                    })
             }

             else
             {
                   // check for required fields
                    
                   if(!Heading)
                   {
                    return res.status(400).json({
                           success : false ,
                           message : 'Heading Required'
                    })
                   }

                   if(!Description)
                   {
                    return res.status(400).json({
                           success : false ,
                           message : 'Description Required'
                    })
                   }

                   // create new data
                   const new_data = new cms_contact_us_details_model({
                         
                          Heading , Description , mail_at , mail ,
                          call_us_on , call , our_address , address , time_schedule ,
                          time
                   })
                   await new_data.save()

                   return res.status(200).json({
                         success : true ,
                         message : 'New Details added Successfully'
                   })

             }
    } catch (error) {
         return res.status(500).json({
               success : false ,
               message : 'Server error',
               error_message : error.message
         })
    }
}


const get_cms_contact_us_details = async( req , res )=> {
    try {
                // check for details
                const get_details = await cms_contact_us_details_model.findOne({ })
                if(!get_details)
                {
                    return res.status(400).json({
                          success : false ,
                          message : 'No Details found'
                    })
                }

                return res.status(200).json({
                      success : true ,
                      message : 'cms_contact_us Details',
                      Details : {
                        Heading : get_details.Heading,
                        Description : get_details.Description,
                        mail_at : get_details.mail_at,
                         mail : get_details.mail ,
                         call_us_on : get_details.call_us_on,
                         call : get_details.call ,
                         our_address : get_details.our_address,
                         address : get_details.address ,
                         time_schedule : get_details.time_schedule,
                         time : get_details.time ,

       
                        
                      }
                })
    } catch (error) {
        return res.status(500).json({
            success : false ,
            message : 'Server error',
            error_message : error.message
      })
    }
}

const cms_contact_for_inquiry = async( req , res )=> {
    try {
          const { Heading , Description } = req.body
          // check for exist details
             const exist_detail = await cms_contact_for_inquiry_Model.findOne({ })
             if(exist_detail)
             {
                    exist_detail.Heading = Heading
                    exist_detail.Description = Description
                    

                    await exist_detail.save()
                    return res.status(200).json({
                           success : true ,
                           message : 'Details Updated Successfully'
                    })
             }

             else
             {
                   // check for required fields
                    
                   if(!Heading)
                   {
                    return res.status(400).json({
                           success : false ,
                           message : 'Heading Required'
                    })
                   }

                   if(!Description)
                   {
                    return res.status(400).json({
                           success : false ,
                           message : 'Description Required'
                    })
                   }

                      
                   const new_data = new cms_contact_for_inquiry_Model({
                          Heading,
                          Description,
                        
                   })
                   await new_data.save()

                   return res.status(200).json({
                         success : true ,
                         message : 'New Details added Successfully'
                   })

             }
    } catch (error) {
         return res.status(500).json({
               success : false ,
               message : 'Server error',
               error_message : error.message
         })
    }
}


const get_cms_contactof_inquiry= async( req , res )=> {
    try {
                // check for details
                const get_details = await cms_contact_for_inquiry_Model.findOne({ })
                if(!get_details)
                {
                    return res.status(400).json({
                          success : false ,
                          message : 'No Details found'
                    })
                }

                return res.status(200).json({
                      success : true ,
                      message : 'cms_contact_ for Inquiry Details',
                      Details : {
                        Heading : get_details.Heading,
                        Description : get_details.Description,
                       

       
                        
                      }
                })
    } catch (error) {
        return res.status(500).json({
            success : false ,
            message : 'Server error',
            error_message : error.message
      })
    }
}
const cms_contact_our_location = async( req , res )=> {
    try {
          const { Heading , Description } = req.body
          // check for exist details
             const exist_detail = await cms_contact_our_location_Model.findOne({ })
             if(exist_detail)
             {
                    exist_detail.Heading = Heading
                    exist_detail.Description = Description
                    

                    await exist_detail.save()
                    return res.status(200).json({
                           success : true ,
                           message : 'Details Updated Successfully'
                    })
             }

             else
             {
                   // check for required fields
                    
                   if(!Heading)
                   {
                    return res.status(400).json({
                           success : false ,
                           message : 'Heading Required'
                    })
                   }

                   if(!Description)
                   {
                    return res.status(400).json({
                           success : false ,
                           message : 'Description Required'
                    })
                   }

                      
                   const new_data = new cms_contact_our_location_Model({
                          Heading,
                          Description,
                        
                   })
                   await new_data.save()

                   return res.status(200).json({
                         success : true ,
                         message : 'New Details added Successfully'
                   })

             }
    } catch (error) {
         return res.status(500).json({
               success : false ,
               message : 'Server error',
               error_message : error.message
         })
    }
}

const get_cms_contact_our_location= async( req , res )=> {
    try {
                // check for details
                const get_details = await cms_contact_our_location_Model.findOne({ })
                if(!get_details)
                {
                    return res.status(400).json({
                          success : false ,
                          message : 'No Details found'
                    })
                }

                return res.status(200).json({
                      success : true ,
                      message : 'cms_contact_ for location Details',
                      Details : {
                        Heading : get_details.Heading,
                        Description : get_details.Description,
                       

       
                        
                      }
                })
    } catch (error) {
        return res.status(500).json({
            success : false ,
            message : 'Server error',
            error_message : error.message
      })
    }
}

 
                                                              /* Contact US page for website */

        // Api for contact us 
             const contact_us = async ( req , res )=> {
                    try {
                           const {first_name , last_name , email , phone_no , subject , message }= req.body
                      // check for all required fields

                      const requiredFields = ['first_name' , 'last_name' , 'email' , 'phone_no' , 'subject' , 'message']
                      for(let field of requiredFields)
                      {
                            if(!req.body[field])
                            {
                                 return res.status(400).json({
                                       success : false ,
                                       message : `Required ${field.replace('_',' ')}`
                                 })
                            }
                      }

                         // const add new Inquiry

                         const new_inq =   new contact_us_Model({
                            first_name , last_name , email , phone_no , subject , message
                         })
                                await new_inq.save()

                                return res.status(200).json({
                                      success : true ,
                                      message : 'Inquiry Generated Successfully'
                                })

                    } catch (error) {
                         return res.status(500).json({
                               success : false ,
                               message : 'Server error',
                               error_message : error.message
                         })
                    }
             }


             // Api for get all the contact us Inquiry details
             const get_all_contact_us_inq = async ( req , res )=> {
                   try {
                          // check for contact inq
                          const all_contact_inq = await contact_us_Model.find().sort({ createdAt : -1 }).lean()

                          if(!all_contact_inq)
                          {
                            return res.status(400).json({
                                  success : false ,
                                  message : 'No Inquiry recived YET'
                            })
                          }

                          return res.status(200).json({
                               success : true ,
                               message : 'All contact us Inquiry',
                               details : all_contact_inq
                          })
                   } catch (error) {
                      return res.status(500).json({
                           success : false,
                           message : 'Server error',
                           error_message : error.message
                      })
                   }
             }

module.exports = {
    login , getadmin , updateAdmin , change_admin_password ,
    otpGenerate , verify_otp , reset_password ,
    add_engineer ,get_all_engineers ,get_Engineer ,
    deleteEngg ,
    add_service , get_services , update_service , delete_service , get_all_Customer ,
    admin_dashboard , get_all_enquiry ,
    assing_enqRequest_to_engineer , get_particular_enq_detail,

    export_engineer , export_customer ,
    all_enquiry_export ,

    // cms Section

    cms_home_why_you_choose_services , get_cms_home_why_you_choose_services ,
    cms_home_service_smart_servelliance_system , get_cms_home_service_smart_servelliance_system ,
    cms_home_service_smart_attandence_system , get_cms_home_service_smart_attendence_system ,
    cms_home_service_smart_Access_system , get_cms_home_service_smart_Access_system,
    cms_home_service_smart_office_system , get_cms_home_service_smart_office_system,
    cms_home_service_smart_security_system , get_cms_home_service_smart_security_system ,
    cms_home_service_smart_home_system , get_cms_home_service_smart_home_system ,

    //contact us 
    contact_us , get_all_contact_us_inq , cms_contact_us_details ,
    get_cms_contact_us_details , cms_contact_for_inquiry , get_cms_contactof_inquiry ,
    cms_contact_our_location , get_cms_contact_our_location
} 