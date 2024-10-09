const nodemailer = require('nodemailer');

const send_adminEmail  = async (recipientEmail, subject, content) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.SMTP_MAIL,
            to: recipientEmail,
            subject: subject,
            html: content ,
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.log(error, 'Email not sent');
    }
};

module.exports = send_adminEmail ;
