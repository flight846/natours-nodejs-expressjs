const nodemailer = require('nodemailer');

const sendEmail = async options => {
    // 1. Create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // 2. Define email options
    const mailOptions = {
        from: 'Jonas Schmedtmann <hello@jonas.io>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: option.html
    }
    // 3. Send email with nodemailer
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;