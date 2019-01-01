const nodemailer = require('nodemailer');
const Email = require('email-templates');

let error_occured = false;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.email_address,
        pass: process.env.email_password
    }
});

const email = new Email({
    send: true,
    preview: false,
    transport: transporter,
    views: {
        options: {
            extension: 'hbs'
        }
    }
});

async function sendVerificationMail(user_email, verification_code) {

    try {
        await email.send({
            template: 'verification',
            message: {
                to: user_email
            },
            locals: {
                url: `${process.env.website}verify/${verification_code}`
            }
        });
    } catch (err) {
        // logger.error('Failed to send EmailVerification email');
        // logger.error(err);
        // console.log(err.message)
        throw new Error("Something went wrong. Please try again later");
    }
}

module.exports = {
    sendVerificationMail
}