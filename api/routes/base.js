const { Router } = require("express");
const User = require("../../models/User");
var createError = require("http-errors");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const Act = require("../../models/Act");
const Reward = require("../../models/Reward");
const Subscriber = require("../../models/Subscriber");
const jwt = require("jsonwebtoken");
const globals = require("../../globals");
const FileSchema = require("../../models/File");
const mail = require("../../send_mail");
const fs = require("fs");
const secret = require("../../secret");
var upload = multer({
  dest: "tmp/"
});
const mongoose = require("mongoose");
const util = require("util");
const fs_delete_file = util.promisify(fs.unlink);
const logger = require("../../logger").winston;
const sanitize = require("sanitize-html");
sanitize.defaults.allowedAttributes = [];
sanitize.defaults.allowedTags = [];

const router = Router();

//Add subscriber
router.post("/add_subscriber", async function(req, res, next) {
  try {
    await Subscriber.create({ email: req.body.email });
    logger.info(`${req.body.email} successfully added to mailing list`);
    res.json({
      message: res.__("added_to_mailing_list")
    });
  } catch (err) {
    next(createError(400, err.message));
    logger.error(`${req.body.email} failed to join mailing list`);
  }
});

//Get latest Acts
router.get("/latest_acts", async function(req, res, next) {
  const latest_acts = await Act.find(
    {
      "enabled.state": true,
      state: "AVAILABLE",
      deleted: false
    },
    { description: true, creation_date: true, name: true }
  )
    .sort({ creation_date: -1 })
    .limit(3);

  res.json(latest_acts);
});

//Contact
router.post("/contact", async function(req, res, next) {
  try {
    await mail.contactUs(req.body);
    res.json({ message: "Success" });
  } catch (err) {
    next(createError(400, err.message));
    logger.error(
      `A message sent from the contact us form failed to be delivered`
    );
  }
});

//Get details
router.get("/details", async function(req, res, next) {
  const promises = [];
  promises.push(Act.find({}).countDocuments());
  promises.push(User.find({}).countDocuments());
  promises.push(Reward.find({}).countDocuments());

  let acts, lives, rewards;
  await Promise.all(promises).then(function(values) {
    acts = values[0];
    lives = values[1];
    rewards = values[2];
  });

  res.json({ acts, lives, rewards });
});

//Login User
router.post("/login", async function(req, res, next) {
  try {
    //Make sure valid details were sent
    if (!req.body.email || !req.body.password)
      throw new Error(res.__("incomplete_request"));

    const email = sanitize(req.body.email);
    const password = req.body.password;

    if (!email || !password) throw new Error(res.__("incomplete_request"));
    //Get enabled user with this email
    const user = await User.findOne({ email: email, enabled: true });
    //If not exists
    //Return error
    if (!user) throw new Error(res.__("invalid_email_password_combo"));
    //Else
    //Check if password matches
    const result = await bcrypt.compare(password, user.password);
    //If not, return error
    if (!result) throw new Error(res.__("invalid_email_password_combo"));
    //If all goes well
    //Create JWT
    const payload = {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      roles: user.roles
    };
    const user_token = jwt.sign(
      payload,
      process.env.SECRET_KEY,
      secret.signOptions
    );
    //Insert this JWT into a cookie (Exists for one hour)
    res.cookie("token", user_token, { maxAge: 3600000 });
    //Insert the refresh token as well (Exists for a year)
    res.cookie("refresh_token", user.refresh_token, {
      maxAge: 31536000000
    });
    // //Redirect to homepage
    // res.redirect('/');
    //Return jwt and refresh token
    logger.info(`${req.body.email} successfully logged in`);
    res.json({ token: user_token, refresh_token: user.refresh_token });
  } catch (err) {
    next(createError(400, err.message));
    logger.error(`${req.body.email} failed to login`);
  }
});

// Register User
router.post("/register", upload.single("file"), async function(req, res, next) {
  try {
    //If the user is already logged in and this is not the admin, give error
    if (req.user && !req.roles.administrator)
      throw new Error(res.__("you_must_be_logged_out"));
    if (req.file) req.body.profile_picture = "./tmp/" + req.file.filename;
    let user = await User.initialize(req.body);

    // await user.save();

    // await user.sendVerificationEmail();
    //If this is an admin and the enabled bit is sent
    if (req.roles && req.roles.administrator && req.body.enabled === "true") {
      //Don't send verification mail
      //Enable the user
      user.enabled = true;
      //Handle email and unverified email
      user.email = user.unverified_email;
      user.unverified_email = undefined;
    } else {
      const verification_token = await User.getUniqueName(
        "email_verification_token",
        70
      );
      await mail.sendVerificationMail(
        user.unverified_email,
        verification_token
      );
      user.email_verification_token = verification_token;
    }

    //If this is an admin
    if (req.roles && req.roles.administrator) {
      //Give roles
      const roles = [];
      if (req.body.act_poster === "true") roles.push({ name: "Act Poster" });
      if (req.body.manager === "true") roles.push({ name: "Manager" });
      if (req.body.reward_provider === "true")
        roles.push({ name: "Reward Provider" });
      if (req.body.administrator === "true")
        roles.push({ name: "Administrator" });
      user.roles = roles;
    }

    await user.save();

    if (req.file) {
      const file_details = {
        uploader_id: user._id,
        proof_name: user.profile_picture,
        original_name: req.file.originalname,
        size: req.file.size
      };

      await FileSchema.create(file_details);
    }

    user = user.toObject();
    delete user.password;
    // res.redirect('/verify_account');
    logger.info(`${req.body.email} successfully registered`);
    res.json(user);
  } catch (err) {
    next(createError(400, err.message));
    logger.error(`${req.body.email} failed to register`);
  } finally {
    //Delete uploaded file
    if (req.file) fs.unlinkSync(req.body.profile_picture);
  }
});

//Verify this user
router.put("/verify/:verification_token", async function(req, res, next) {
  try {
    const token = sanitize(req.params.verification_token);
    //Get the user with this verification token
    const user = await User.findOne({ email_verification_token: token });
    //If exists
    if (user) {
      //Verify his email address
      user.email = user.unverified_email;
      user.unverified_email = undefined;
      //Delete his verification token
      user.email_verification_token = undefined;
      //Enable the user
      user.enabled = true;
      //Create a JWT
      const payload = {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        roles: user.roles
      };
      const user_token = jwt.sign(
        payload,
        process.env.SECRET_KEY,
        secret.signOptions
      );
      //Insert this JWT into a cookie (Exists for one hour)
      res.cookie("token", user_token, { maxAge: 3600000 });
      //Insert the refresh token as well (Exists for a year)
      res.cookie("refresh_token", user.refresh_token, {
        maxAge: 31536000000
      });
      await user.save();
      //Delete all users whose unverified email is this user's email
      //Unlink their profile pictures first if exists
      const about_to_be_deleted_users = await User.find({
        unverified_email: user.email
      });
      const promises = [];
      about_to_be_deleted_users.forEach(user => {
        if (user.profile_picture) {
          const image = `${process.env.files_folder}/${user.profile_picture}`;
          promises.push(fs_delete_file(image));
          //Remove from filesschema as well
          promises.push(
            FileSchema.deleteOne({ proof_name: user.profile_picture })
          );
        }
      });
      if (promises.length > 0) await Promise.all(promises);
      await User.deleteMany({ unverified_email: user.email });
      logger.info(`${user.email} successfully verified`);
      res.json({
        token: user_token,
        refresh_token: user.refresh_token
      });
      res.end();
      return;
    } else {
      throw new Error("Invalid token");
    }
  } catch (err) {
    next(createError(400, err.message));
    logger.error(
      `User with this verification token ${
        req.params.verification_token
      } was not verified`
    );
  }
});

module.exports = router;
