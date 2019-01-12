const nodemailer = require("nodemailer");
const Email = require("email-templates");
const secret = require("./secret");
const logger = require("./logger").winston;
let error_occured = false;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: secret.email_address,
    pass: secret.email_password
  }
});

const email = new Email({
  send: true,
  preview: false,
  transport: transporter,
  views: {
    options: {
      extension: "hbs"
    }
  }
});

async function sendVerificationMail(user_email, verification_code) {
  try {
    await email.send({
      template: "verification",
      message: {
        to: user_email
      },
      locals: {
        url: `${process.env.website}verify/${verification_code}`
      }
    });
    logger.info(`Verification email successfully sent to ${user_email}`);
  } catch (err) {
    logger.error(`Verification email failed while sending to ${user_email}`);
    throw new Error("Something went wrong. Please try again later");
  }
}

async function sendProofApprovalMail(user_email, act_id) {
  try {
    await email.send({
      template: "act_approval",
      message: {
        to: user_email
      },
      locals: {
        url: process.env.website,
        act_id: act_id
      }
    });
    logger.info(`Proof approval email successfully sent to ${user_email}`);
  } catch (err) {
    logger.error(`Proof approval email failed while sending to ${user_email}`);
    throw new Error("Something went wrong. Please try again later");
  }
}

async function sendProofRejectionMail(user_email, act_id, reason) {
  try {
    await email.send({
      template: "act_rejection",
      message: {
        to: user_email
      },
      locals: {
        url: process.env.website,
        act_id,
        reason
      }
    });
    logger.info(`Proof rejection email successfully sent to ${user_email}`);
  } catch (err) {
    logger.error(`Proof rejection email failed while sending to ${user_email}`);
    throw new Error("Something went wrong. Please try again later");
  }
}

async function sendNewReviewNotice(user_email) {
  try {
    await email.send({
      template: "new_review",
      message: {
        to: user_email
      }
    });
    logger.info(`New review email successfully sent to ${user_email}`);
  } catch (err) {
    logger.error(`New review email failed while sending to ${user_email}`);
    throw new Error("Something went wrong. Please try again later");
  }
}

async function sendRewardTransactionCompleteNotice(user_email, reward_id) {
  try {
    await email.send({
      template: "complete_reward_transaction",
      message: {
        to: user_email
      },
      locals: {
        url: process.env.website,
        reward_id
      }
    });
    logger.info(`Reward transaction email successfully sent to ${user_email}`);
  } catch (err) {
    logger.error(
      `Reward transaction email failed while sending to ${user_email}`
    );
    throw new Error("Something went wrong. Please try again later");
  }
}

async function sendRewardcollectedNoticeToRewardProvider(
  user_email,
  reward_id
) {
  try {
    await email.send({
      template: "reward_collected",
      message: {
        to: user_email
      },
      locals: {
        url: process.env.website,
        reward_id
      }
    });
    logger.info(`Reward collected email successfully sent to ${user_email}`);
  } catch (err) {
    logger.error(
      `Reward collected email failed while sending to ${user_email}`
    );
    throw new Error("Something went wrong. Please try again later");
  }
}

async function notifyManagersOfProof(user_email, user_count) {
  try {
    await email.send({
      template: "notify_managers",
      message: {
        to: user_email
      },
      locals: {
        url: secret.website,
        user_count
      }
    });
    logger.info(
      `Managers proof notification email successfully sent to ${user_email}`
    );
  } catch (err) {
    logger.error(
      `Managers proof notification email failed while sending to ${user_email}`
    );
    throw new Error("Something went wrong. Please try again later");
  }
}

async function notifyRewardProvidersOfRequestOrClaim(user_email) {
  try {
    await email.send({
      template: "notify_reward_providers",
      message: {
        to: user_email
      },
      locals: {
        url: secret.website
      }
    });
    logger.info(
      `Reward provider request/claim notification email successfully sent to ${user_email}`
    );
  } catch (err) {
    logger.error(
      `Reward provider request/claim notification email failed while sending to ${user_email}`
    );
    throw new Error("Something went wrong. Please try again later");
  }
}

module.exports = {
  sendNewReviewNotice,
  sendVerificationMail,
  notifyManagersOfProof,
  sendProofApprovalMail,
  sendProofRejectionMail,
  sendRewardTransactionCompleteNotice,
  notifyRewardProvidersOfRequestOrClaim,
  sendRewardcollectedNoticeToRewardProvider
};
