const { Router } = require("express");
const User = require("../../models/User");
const globals = require("../../globals");
var createError = require("http-errors");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const Act = require("../../models/Act");
const Reward = require("../../models/Reward");
const Subscriber = require("../../models/Subscriber");
const jwt = require("jsonwebtoken");
const FileSchema = require("../../models/File");
const mail = require("../../send_mail");
const fs = require("fs");
const os = require("os");
const secret = require("../../secret");
const uuidv4 = require("uuid/v4");
var upload = multer({
  dest: os.tmpdir()
});
const util = require("util");
const fs_delete_file = util.promisify(fs.unlink);
const logger = require("../../logger").winston;
const sanitize = require("sanitize-html");
sanitize.defaults.allowedAttributes = [];
sanitize.defaults.allowedTags = [];
const passwordValidator = require("password-validator");
const schema = new passwordValidator();
schema
  .is()
  .min(8)
  .is()
  .max(30)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits()
  .has()
  .symbols();

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

//Check if reset password token exists
router.get("/password_reset_token/:id", async function(req, res, next) {
  const user_count = await User.find({
    password_reset_token: req.params.id
  }).countDocuments();
  res.json({ user_count });
});

//Contact
router.post("/contact", async function(req, res, next) {
  try {
    await mail.contactUs(req.body);
    res.json({ message: "Success" });
    logger.info(`A message was successfully sent from the contact us form`);
  } catch (err) {
    next(createError(400, err.message));
    logger.error(
      `A message sent from the contact us form failed to be delivered`
    );
  }
});

//Forgot Password
router.post("/forgot_password", async function(req, res, next) {
  try {
    //Check if email was sent
    //If not sent, error
    if (!req.body.email) throw new Error("Invalid email");
    //Sanitize email
    const email = sanitize(req.body.email);
    //Check if email has associated account with ABC
    const user = await User.findOne({ email: email });
    //If exists
    if (user) {
      //Generate password reset token
      const token = uuidv4();
      user.password_reset_token = token;
      //Send password reset token via email
      await mail.forgot_password(user.email, token);
      //Save password reset token
      await user.save();
    }
    //Send success message
    res.json({ message: "Success" });
    logger.info(
      `Password reset instructions were sent to ${req.body.email}`
    );
  } catch (err) {
    next(createError(400, err.message));
    logger.error(
      `Password reset instructions could not be sent to ${req.body.email}`
    );
  }
});

//Reset Password
router.post("/reset_password", async function(req, res, next) {
  try {
    //Check that password and reset token were sent
    //If not, give error
    if (!req.body.password || !req.body.reset_password) {
      throw new Error("Incomplete details");
    }
    //Check that password is strong
    //If not, error
    if (!schema.validate(req.body.password))
      throw new Error(
        "Password must have at least 8, and at most 30 characters. Password must also have at least one number, uppercase, lowercase letter and one symbol."
      );
    //Check that reset token is valid
    const user = await User.findOne({
      password_reset_token: req.body.reset_password
    });
    //If not error
    if (!user) throw new Error("Invalid details");
    //If both are good
    else {
      //Change password
      await bcrypt.hash(req.body.password, 12).then(function(hash) {
        user.password = hash;
      });
      //Change the refresh_token
      user.refresh_token = uuidv4();
      //Remove password reset token
      user.password_reset_token = undefined;
      await user.save();
      //Return success message
      res.json({ message: "Success" });
      logger.info(
        `Password was reset for this reset token: ${
          req.body.reset_password
        }`
      );
    }
  } catch (err) {
    next(createError(400, err.message));
    logger.error(
      `Password could not be reset for this reset token: ${
        req.body.reset_password
      }`
    );
  }
});

//Show acts
router.get("/view_acts", async function(req, res, next) {
  try {
    //Get list of act IDs this user has completed
    //Get 10 latest available acts WRT user search query
    let search = {};
    if (req.query.search)
      search = { $text: { $search: sanitize(req.query.search) } };
    // search = { 'users_under_review.id': { '$not': { $eq: req.user.id } } };

    //Act must be enabled
    const enabled = {
      state: true
    };

    let page = parseInt(sanitize(req.query.page));
    let act_type = sanitize(req.query.act_type);
    let sort = sanitize(req.query.sort);
    let type = sanitize(req.query.type);
    let order = parseInt(sanitize(req.query.order));
    const this_object = this;

    //This ensures that when an act poster tries to get his acts
    //Enabled and disabled acts are returned
    if (type != "MY_ACTS") search.enabled = enabled;

    // if (type == "undefined")
    //     type = req.cookies.type;

    //If this is a manager, the default view should be All acts
    if (req.roles && req.roles.manager)
      if (!type || globals.user_act_types.indexOf(type) === -1) type = "ALL";

    if (type == "ALL") delete search.enabled;
    else if (type == "ENABLED") search.enabled.state = true;
    else if (type == "DISABLED") search.enabled.state = false;

    if (!type || globals.user_act_types.indexOf(type) === -1)
      type = "AVAILABLE";

    //Deleted acts should not show up
    search["deleted"] = false;

    if (type == "AVAILABLE") {
    } else if (type == "UNDER_REVIEW")
      search["users_under_review.id"] = req.user.id;
    else if (type == "COMPLETED") search["completed_users.id"] = req.user.id;
    else if (type == "REJECTED") search["rejected_users.id"] = req.user.id;
    else if (type == "MY_ACTS") search["act_provider.id"] = req.user.id;

    //Handle invalid page
    if (!page || page < 1) page = 1;

    //Handle invalid act type
    if (!act_type || globals.act_types.indexOf(act_type) === -1)
      act_type = "AVAILABLE";

    //This ensures that when an act poster tries to get his acts
    //Available and unavailable acts are returned
    if (type != "MY_ACTS") search.state = act_type;

    //Handle invalid act sort category
    if (!sort || globals.user_acts_sort_categories.indexOf(sort) === -1)
      sort = "name";

    //Handle invalid act order category
    if (!order || globals.user_acts_order_categories.indexOf(order) === -1)
      order = 1;

    let offset = (page - 1) * 10;

    //If user requests completed acts
    //Disregard deleted, enabled and available states
    if (type == "COMPLETED") {
      delete search.deleted;
      delete search.enabled;
      delete search.state;
    }

    let sort_query = { [sort]: order };
    if (type == "AVAILABLE") {
      sort_query = [["importance", -1], [sort, order]];
    }

    //For some unknown reason, the below command gives this error: Projection cannot have a mix of inclusion and exclusion.
    // const promised_acts = Act.find(search, { users_who_clicked_on_this_act: false, users_who_completed_this_act: false }).sort({ [sort]: order }).skip(offset).limit(10).lean();
    const promised_acts = Act.find(search)
      .sort(sort_query)
      .skip(offset)
      .limit(10)
      .lean();
    const promised_count = Act.find(search).countDocuments();

    //Get the 3 highest completed acts this month
    //Get current month and year
    const date = new Date();
    const this_month = date.getMonth();
    const this_year = date.getFullYear();
    let next_year = this_year;
    //Get next month (If 12, make it 0)
    let next_month = this_month + 1;
    if (next_month > 11) {
      next_month = 0;
      next_year += 1;
    }
    //Get first days in both months

    lower_date = new Date(this_year, this_month, 1);
    upper_date = new Date(next_year, next_month, 1);

    //Get the count of completed users in between this period per act
    const promised_best_acts_for_this_month = Act.aggregate([
      {
        //Get acts that have been completed this month
        $match: {
          completed_users: { $exists: true, $ne: [] },
          "completed_users.time": { $gte: lower_date },
          "completed_users.time": { $lt: upper_date }
        }
      },
      //Split based on the users who completed the acts
      { $unwind: "$completed_users" },
      //Get only the users who completed each act in the specified period
      {
        $match: {
          "completed_users.time": { $gte: lower_date },
          "completed_users.time": { $lt: upper_date }
        }
      },
      //Count the users per act and get each act's details
      {
        $group: {
          _id: "$_id",
          act: {
            $addToSet: {
              name: "$name",
              description: "$description"
            }
          },
          count: {
            $sum: 1
          }
        }
      },
      //Sort by count in decreasing order
      { $sort: { count: -1 } },
      //Get only 3 acts
      { $limit: 3 }
    ]);

    let promises = [
      promised_acts,
      promised_count,
      promised_best_acts_for_this_month
    ];

    if (type == "COMPLETED") {
      let this_search = req.query.search;
      if (!this_search) this_search = "";
      const promised_completed_acts = Act.aggregate([
        {
          $match: {
            //Handle search
            $or: [{ $text: { $search: this_search } }, {}],
            "completed_users.id": mongoose.Types.ObjectId(req.user.id)
          }
        },
        {
          ////Get all cases where this user has completed the act
          $unwind: "$completed_users"
        },
        {
          $match: { "completed_users.id": mongoose.Types.ObjectId(req.user.id) }
        },
        //Handle pagination, sort and sort direction
        { $sort: { [sort]: order } },
        { $skip: offset },
        { $limit: 10 }
        // { $project: { _id: false } }
      ]);

      const promised_completed_acts_count = Act.aggregate([
        {
          $match: {
            //Handle search
            $or: [{ $text: { $search: this_search } }, {}],
            "completed_users.id": mongoose.Types.ObjectId(req.user.id)
          }
        },
        {
          ////Get all cases where this user has completed the act
          $unwind: "$completed_users"
        },
        {
          $match: { "completed_users.id": mongoose.Types.ObjectId(req.user.id) }
        },
        //Count documents
        {
          $count: "no"
        }
      ]);

      promises.push(promised_completed_acts);
      promises.push(promised_completed_acts_count);
    }

    let acts;
    let count;
    let reward_points;
    let best_acts;
    let result = {};
    let counter;
    await Promise.all(promises).then(function(values) {
      // result.result = values[0];
      // result.total_count = values[1][0]['count'];
      acts = values[0];
      count = values[1];
      reward_points = values[2];
      best_acts = values[2];
      console.log(values[5]);
      if (values[4]) acts = values[4];
      if (values[5]) {
        if (values[5][0] != undefined) {
          count = values[5][0].no;
        } else {
          count = 0;
        }
      }
    });

    const act_count = count;
    count = Math.ceil(count / 10);
    const total = [];
    for (let i = 0; i < count; i++) total.push(1);
    let current_page = process.env.website + "acts?";

    if (!req.query.page) req.query.page = 1;

    //Loop through the query parameters and append them to the url;
    if (req.query.search)
      current_page = current_page + "search=" + req.query.search + "&";
    if (req.query.sort)
      current_page = current_page + "sort=" + req.query.sort + "&";
    if (req.query.order)
      current_page = current_page + "order=" + req.query.order + "&";

    logger.info(`Viewer successfully got acts`);
    res.json({
      reward_points,
      acts,
      best_acts,
      type,
      current_page,
      act_count,
      query: req.query,
      count,
      title: "Acts",
      acts,
      total_acts: total,
      user: req.user,
      roles: req.roles
    });
  } catch (err) {
    console.log(err)
    logger.error(`Viewer failed to get acts`);
    next(createError(400, err.message));
  }
});

//Get individual act
router.get("/:id/view_act", async function(req, res, next) {
  try {
    const promised_act = Act.findById(
      req.params.id,
      "act_provider importance repeatable deleted how_to_submit_evidences start_time amount expiration_date end_time image description tags enabled name reward_points state total_number_of_clicks total_number_of_completions"
    ).lean();

    const promises = [promised_act];
    let act;
    await Promise.all(promises).then(function(values) {
      act = values[0];
    });

    //If act does not exist, error
    if (!act) throw new Error(res.__("act_does_not_exist"));


    //If this act has been deleted
    //Only admins and users who have completed it can view it

    if (act.deleted == true) {
      let display_act = false;
      if (req.roles && req.roles.administrator) {
        display_act = true;
      }
      if (!display_act) {
        throw new Error(res.__("act_has_been_deleted"));
      }
    }

    logger.info(`Viewer successfully got act ${req.params.id}`);
    res.json({ act, roles: req.roles });
  } catch (err) {
    next(createError(400, err.message));
    logger.error(`Viewer failed to get act ${req.params.id}`);
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
    if (req.file)
      req.body.profile_picture = os.tmpdir() + "\\" + req.file.filename;
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
