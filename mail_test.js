const nodemailer = require('nodemailer');
const Email = require('email-templates');

async function sendMail() {
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

    try {
        await email.send({
            template: 'test',
            message: {
                to: 'viirockn7@gmail.com'
            },
            locals: {
                appUrl: "My APP URL",
                code: 'My CODE'
            }
        });
    } catch (err) {
        // logger.error('Failed to send EmailVerification email');
        // logger.error(err);
        throw new Error("Something went wrong. Please try again later");
    }
}

module.exports = {
    sendMail
}