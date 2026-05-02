const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    console.log("Attempting to send email to:", options.email);
    console.log("Using Email:", process.env.EMAIL_USERNAME);
    
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
        connectionTimeout: 10000 // fail after 10 seconds
    });

    const mailOptions = {
        from: "ShikshaSetu Support <support@shikshasetu.com>",
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
