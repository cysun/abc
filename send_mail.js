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

async function sendProofApprovalMail(user_email, act_id) {

    try {
        await email.send({
            template: 'act_approval',
            message: {
                to: user_email
            },
            locals: {
                url: process.env.website,
                act_id: act_id
            }
        });
    } catch (err) {
        // logger.error('Failed to send EmailVerification email');
        // logger.error(err);
        // console.log(err.message)
        throw new Error("Something went wrong. Please try again later");
    }
}

async function sendProofRejectionMail(user_email, act_id, reason) {

    try {
        await email.send({
            template: 'act_rejection',
            message: {
                to: user_email
            },
            locals: {
                url: process.env.website,
                act_id,
                reason
            }
        });
    } catch (err) {
        // logger.error('Failed to send EmailVerification email');
        // logger.error(err);
        // console.log(err.message)
        throw new Error("Something went wrong. Please try again later");
    }
}

async function sendNewReviewNotice(user_email) {

    try {
        await email.send({
            template: 'new_review',
            message: {
                to: user_email
            }
        });
    } catch (err) {
        // logger.error('Failed to send EmailVerification email');
        // logger.error(err);
        // console.log(err.message)
        throw new Error("Something went wrong. Please try again later");
    }
}

async function sendRewardTransactionCompleteNotice(user_email, reward_id) {

    try {
        await email.send({
            template: 'complete_reward_transaction',
            message: {
                to: user_email
            },
            locals: {
                url: process.env.website,
                reward_id
            }
        });
    } catch (err) {
        // logger.error('Failed to send EmailVerification email');
        // logger.error(err);
        throw new Error("Something went wrong. Please try again later");
    }
}

async function sendRewardcollectedNoticeToRewardProvider(user_email, reward_id) {

    try {
        await email.send({
            template: 'reward_collected',
            message: {
                to: user_email
            },
            locals: {
                url: process.env.website,
                reward_id
            }
        });
    } catch (err) {
        // logger.error('Failed to send EmailVerification email');
        // logger.error(err);
        throw new Error("Something went wrong. Please try again later");
    }
}

module.exports = {
    sendNewReviewNotice,
    sendVerificationMail,
    sendProofApprovalMail,
    sendProofRejectionMail,
    sendRewardTransactionCompleteNotice,
    sendRewardcollectedNoticeToRewardProvider
}