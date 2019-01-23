const nodemailer = require('nodemailer');

async function sendMail(email, subject, message) {
    let error_occured = false;

    const transporter = nodemailer.createTransport({
        host: 'localhost',
        port: 25,
        secure: false,
        ignoreTLS: true
    });

    const mailOptions = {
        from: process.env.email_address,
        to: email,
        subject: subject,
        html: message
    };

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error)
            error_occured = true;
    });

    if (error_occured)
        throw new Error("Something went wrong. Please try again later");
}

module.exports = {
    sendMail
}
