const { Router } = require("express");
const User = require("../../models/User");
const globals = require("../../globals");
const Act = require("../../models/Act");
const Tag = require("../../models/Tag");
const Event_Act = require("../../models/Event");
var createError = require("http-errors");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = require("../../secret");
const mongoose = require("mongoose");
const fs = require("fs");
const sanitize = require("sanitize-html");
const util = require("util");
const fs_delete_file = util.promisify(fs.unlink);
const atob = require("atob");
const fs_rename_file = util.promisify(fs.rename);
const mail = require("../../send_mail");
const mailTest = require("../../mail_test");
const moment = require("moment");
sanitize.defaults.allowedAttributes = [];
sanitize.defaults.allowedTags = [];
var upload = multer({
  dest: "tmp/"
});

const router = Router();

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function uploadMultipleFiles(re, original_name, file_name, req) {
  let unique_name, ext;
  return Act.getUniqueProofImageName()
    .then(function(unique_image_name) {
      unique_name = unique_image_name;
      //Get extension for each file
      ext = re.exec(original_name)[1];
      //If no extension, use empty string
      if (ext == undefined)
        //If no extension, use empty string
        ext = "";
      else ext = `.${ext}`;
    })
    .then(function() {
      //Move the file to the acts proof folder with the new name and extension
      fs_rename_file(
        `./tmp/${file_name}`,
        `${process.env.act_picture_folder}${unique_name}${ext}`
      );
    })
    .then(function() {
      //Save the new file name and the uploaded file name
      if (!req.user.proof_of_completion) req.user.proof_of_completion = [];
      req.user.proof_of_completion.push({
        original_name: original_name,
        new_name:
          process.env.website +
          process.env.display_act_picture_folder +
          unique_name +
          ext
      });
    });
}

//Approve user act proof
router.put("/:act_id/user/:user_id/approve", async function(req, res, next) {
  const session = await mongoose.startSession();
  try {
    let promises = [];
    // const user = await User.findById(req.params.user_id)
    const promised_user = User.findOne(
      { _id: req.params.user_id, "acts.id": req.params.act_id },
      { "acts.$": true, first_name: true, last_name: true, email: true }
    ).lean();
    const promised_act = Act.findById(req.params.act_id);

    let user, act;
    promises = [promised_user, promised_act];
    await Promise.all(promises).then(function(values) {
      user = values[0];
      act = values[1];
    });

    const user_who_completed_this_act = Object.assign({}, user);
    user_who_completed_this_act.id = user_who_completed_this_act._id;
    delete user_who_completed_this_act._id;
    user_who_completed_this_act.state = "COMPLETED";
    user_who_completed_this_act.proof_of_completion =
      user_who_completed_this_act.acts[0].proof_of_completion;
    //Add this manager as the reviewer of this proof
    user_who_completed_this_act.review_of_proof = {
      reviewer_id: req.user.id,
      reviewer_name: `${req.user.first_name} ${req.user.last_name}`,
      //Note the time of the review
      time_of_review: Date.now(),
      result: true
    };

    session.startTransaction();

    const promised_act_change = Act.findByIdAndUpdate(
      req.params.act_id,
      {
        $push: {
          //Add this user to the users who have completed this act subdocument of acts
          users_who_completed_this_act: user_who_completed_this_act,
          //Add this user to the completed users subdocument of acts subdocument
          completed_users: user_who_completed_this_act
        },
        $pull: {
          //Remove this user from the users who are under review act subdocument
          users_under_review: { id: req.params.user_id },
          //Remove this user from the user who are rejected in the acts subdocument
          rejected_users: { id: req.params.user_id }
        },
        //Increment total number of completions
        $inc: { total_number_of_completions: 1 }
      },
      { session }
    );

    const promised_user_change = User.findOneAndUpdate(
      { _id: req.params.user_id, "acts.id": req.params.act_id },
      {
        //Change the state of this act to completed in the user object
        "acts.$.state": "COMPLETED",
        "acts.$.time": Date.now(),
        //Add the points of this act to the user points
        $inc: { points: act.reward_points }
      },
      { session }
    );

    promises = [promised_act_change, promised_user_change];
    await Promise.all(promises);

    //Send approved proof mail
    await mail.sendProofApprovalMail(user.email, req.params.act_id);
    await session.commitTransaction();

    res.json({ message: "Success" });
  } catch (err) {
    await session.abortTransaction();
    next(createError(400, err.message));
  } finally {
    session.endSession();
  }
});

//Disapprove user act proof
router.put("/:act_id/user/:user_id/disapprove", async function(req, res, next) {
  const session = await mongoose.startSession();
  try {
    let promises = [];
    // const user = await User.findById(req.params.user_id)
    const promised_user = User.findOne(
      { _id: req.params.user_id, "acts.id": req.params.act_id },
      { "acts.$": true, first_name: true, last_name: true, email: true }
    ).lean();
    const promised_act = Act.findById(req.params.act_id);

    let user, act;
    promises = [promised_user, promised_act];
    await Promise.all(promises).then(function(values) {
      user = values[0];
      act = values[1];
    });

    const user_who_completed_this_act = Object.assign({}, user);
    user_who_completed_this_act.id = user_who_completed_this_act._id;
    delete user_who_completed_this_act._id;
    user_who_completed_this_act.state = "REJECTED";
    user_who_completed_this_act.proof_of_completion =
      user_who_completed_this_act.acts[0].proof_of_completion;
    //Add this manager as the reviewer of this proof
    user_who_completed_this_act.review_of_proof = {
      reviewer_id: req.user.id,
      reviewer_name: `${req.user.first_name} ${req.user.last_name}`,
      //Note the time of the review
      time_of_review: Date.now(),
      result: false,
      comments: req.body.comments
    };

    session.startTransaction();

    const promised_act_change = Act.findByIdAndUpdate(
      req.params.act_id,
      {
        $push: {
          //Add this user to the users who have completed this act subdocument of acts
          users_who_completed_this_act: user_who_completed_this_act,
          //Add this user to the rejected users subdocument of acts subdocument
          rejected_users: user_who_completed_this_act
        },
        $pull: {
          //Remove this user from the users who are under review act subdocument
          users_under_review: { id: req.params.user_id }
        }
      },
      { session }
    );

    const promised_user_change = User.findOneAndUpdate(
      { _id: req.params.user_id, "acts.id": req.params.act_id },
      {
        //Change the state of this act to rejected in the user object
        "acts.$.comments": req.body.comments,
        "acts.$.state": "REJECTED",
        "acts.$.time": Date.now()
      },
      { session }
    );

    promises = [promised_act_change, promised_user_change];
    await Promise.all(promises);

    //Send rejected proof mail
    // await mail.sendMail(user.email, "Your proof has been rejected", `<p>Reason: ${req.body.comments}</p><p>Click <a href='${process.env.website}acts/${req.params.act_id}'>here</a> to change your proof</p>`);
    await mail.sendProofRejectionMail(
      user.email,
      req.params.act_id,
      req.body.comments
    );

    await session.commitTransaction();
    res.json({ message: "Success" });
  } catch (err) {
    await session.abortTransaction();
    next(createError(400, err.message));
  } finally {
    session.endSession();
  }
});

//Show acts that are in review
router.get("/review", async function(req, res, next) {
  try {
    let page = parseInt(sanitize(req.query.page));
    //Handle invalid page
    if (!page || page < 1) page = 1;

    let offset = (page - 1) * 10;
    const promised_acts = Act.find({
      users_under_review: { $exists: true, $ne: [] }
    })
      .skip(offset)
      .limit(10)
      .lean();
    const promised_count = Act.find({
      users_under_review: { $exists: true, $ne: [] }
    }).countDocuments();

    let promises = [promised_acts, promised_count];
    let acts;
    let count;
    let result = {};
    let counter;
    await Promise.all(promises).then(function(values) {
      // result.result = values[0];
      // result.total_count = values[1][0]['count'];
      acts = values[0];
      count = values[1];
    });
    const act_count = count;
    count = Math.ceil(count / 10);
    const total = [];
    for (let i = 0; i < count; i++) total.push(1);
    // acts.forEach(element => {
    //     if (!element.image)
    //         element.image = process.env.website + 'images/banner1.jpg';
    // });
    let current_page = process.env.website + "manage/proofs?";

    if (!req.query.page) req.query.page = 1;

    //Loop through the query parameters and append them to the url;

    // console.log(req.roles);

    res.json({
      acts,
      current_page,
      act_count,
      query: req.query,
      count,
      title: "Acts",
      total_acts: total,
      user: req.user,
      roles: req.roles
    });

    // res.json({acts, roles: req.roles});
  } catch (err) {
    // console.log(err);
    next(createError(400, err.message));
  }
});

//Upload proof of completion
router.post("/:id/complete", upload.array("files"), async function(
  req,
  res,
  next
) {
  // const image = './tmp/' + req.file.filename
  const session = await mongoose.startSession();
  try {
    //Non logged in users can't access this endpoint
    if (!req.user) throw new Error("You do not have authorization");

    const this_user = await User.findById(req.user.id);
    if (this_user.email == "other_user@email.com")
      console.log("Other user was here");

    //Get the act
    const this_act = await Act.findById(req.params.id);
    //If it's non existent, disabled, unavailable or deleted, fail
    if (
      !this_act ||
      !this_act.enabled.state ||
      this_act.state == "NOT_AVAILABLE" ||
      this_act.deleted
    )
      throw new Error("Invalid Act");

    var re = /(?:\.([^.]+))?$/;

    //Make sure at least one file was uploaded
    if (!req.files)
      //If not, give error
      throw new Error("No files were uploaded");

    //Get unique names for each file upload
    let promises = [];
    for (let i = 0; i < req.files.length; i++)
      promises.push(
        uploadMultipleFiles(
          re,
          req.files[i].originalname,
          req.files[i].filename,
          req
        )
      );

    await Promise.all(promises);

    //Save changes in the database
    //return json of all proofs for this act for this person
    // Update the act and the user
    promises = [];
    const user = req.user;
    user.state = "UNDER_REVIEW";

    session.startTransaction();

    //Get the last user act
    const promised_act_change = Act.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
      { $unwind: { path: "$users_who_completed_this_act" } },
      {
        $match: {
          "users_who_completed_this_act.id": mongoose.Types.ObjectId(
            req.user.id
          )
        }
      },
      { $sort: { "users_who_completed_this_act.time_completed": -1 } },
      { $limit: 1 },
      { $project: { users_who_completed_this_act: 1 } }
    ])
      .session(session)
      .then(async function(act) {
        //Check if it's under review
        if (
          !act[0] ||
          act[0].users_who_completed_this_act.state != "UNDER_REVIEW"
        ) {
          //If not
          //Create a new user act
          await Act.findByIdAndUpdate(
            req.params.id,
            {
              $push: { users_who_completed_this_act: user },
              $addToSet: { users_under_review: user },
              // Remove this user from the users who were rejected
              $pull: { rejected_users: { id: req.user.id } }
            },
            { session }
          );
        }
        //If it's under review
        else {
          await Act.findOneAndUpdate(
            {
              "users_who_completed_this_act.id":
                act[0].users_who_completed_this_act.id
            },
            {
              $push: {
                "users_who_completed_this_act.$.proof_of_completion":
                  user.proof_of_completion
              }
            },
            { session }
          );
          await Act.findOneAndUpdate(
            { "users_under_review.id": act[0].users_who_completed_this_act.id },
            {
              $push: {
                "users_under_review.$.proof_of_completion":
                  user.proof_of_completion
              }
              //Remove this user from the users who were rejected
              // $pull: { rejected_users: { id: mongoose.Types.ObjectId(req.user.id) } }
            },
            { session }
          );
        }

        // throw new Error("not real error")
      });

    const act = {
      id: req.params.id,
      state: "UNDER_REVIEW",
      time: Date.now(),
      proof_of_completion: user.proof_of_completion
    };

    //Upsert
    //Change act to under review
    //Update time as well
    //Add the new files that were uploaded as well
    const promised_user_change = User.findOneAndUpdate(
      { _id: user.id, "acts.id": req.params.id },
      {
        $set: { "acts.$.state": "UNDER_REVIEW", "acts.$.time": Date.now() },
        $addToSet: { "acts.$.proof_of_completion": user.proof_of_completion }
      },
      { session },
      async function(err, numberAffected, rawResponse) {
        if (!numberAffected) {
          //If not exists, insert act
          await User.findByIdAndUpdate(
            user.id,
            { $push: { acts: act } },
            { session }
          );
        }
      }
    );

    promises.push(promised_act_change, promised_user_change);
    await Promise.all(promises);

    // //Redirect to calling page with success message
    // res.redirect(url.parse(req.headers.referer).pathname + '?Success=' + 'Success');

    //Return only the new uploads
    await session.commitTransaction();
    res.json(req.user.proof_of_completion);
  } catch (err) {
    //Delete uploaded files
    const this_promises = [];
    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        this_promises.push(fs_delete_file("./tmp/" + req.files[i].filename));
      }
      await Promise.all(this_promises);
    }
    await session.abortTransaction();
    next(createError(400, err.message));
  } finally {
    session.endSession();
  }
});

//Get events
router.get("/calendar", async function(req, res, next) {
  //Get all events in the range
  const events = await Event_Act.find(
    {
      start_time: { $gte: req.query.start },
      end_time: { $lte: req.query.end }
    },
    { name: 1, start_time: 1, end_time: 1 }
  ).lean();

  events.forEach(element => {
    element.title = element.name;
    element.start = element.start_time + 'Z';
    element.end = element.end_time + 'Z';
    element.url = `acts/${element._id}`;
  });

  res.json(events);
});

//Get individual act
router.get("/:id", async function(req, res, next) {
  //Get act from Act table
  //Get user's relationship with act from user table
  //Combine and deliver

  try {
    //Only logged in users can view act
    if (!req.user) throw new Error("You do not have authorization");

    const promised_act = Act.findById(
      req.params.id,
      "act_provider deleted start_time end_time description tags enabled name reward_points state total_number_of_clicks total_number_of_completions"
    ).lean();
    const promised_user = User.findOne(
      { _id: req.user.id, "acts.id": req.params.id },
      { "acts.$": 1 }
    );
    //Add this user to the act click counter
    const promised_click_counter = Act.findByIdAndUpdate(req.params.id, {
      $push: { users_who_clicked_on_this_act: req.user },
      $inc: { total_number_of_clicks: 1 }
    });
    const promises = [promised_act, promised_user, promised_click_counter];
    let act, user_act;
    await Promise.all(promises).then(function(values) {
      act = values[0];
      user_act = values[1];
    });

    //If act does not exist, error
    if (!act) throw new Error("Act does not exist");

    //If this request is coming from the act poster who uploaded it or an admin
    //Return the act
    let creator_rights = false;
    if (req.roles && req.roles.act_poster) {
      if (req.roles.administrator || act.act_provider.id == req.user.id)
        creator_rights = true;
    }
    if (!creator_rights) {
      //If this act is unavailable and this user has not completed it and this person doesn't have creator rights (Rightful act poster or admin)
      if (act.state == "NOT_AVAILABLE" && !user_act)
        throw new Error("Act is not available");
      if (user_act)
        if (
          act.state == "NOT_AVAILABLE" &&
          user_act.acts[0].state != "COMPLETED"
        )
          throw new Error("Act is not available");
      //If act is disabled and available
      //And this is a manager
      if (req.roles && req.roles.manager) {
        //Return the act
      } else {
        if (act.enabled.state == false && !user_act)
          throw new Error("Act is disabled");
        if (user_act)
          if (
            act.enabled.state == false &&
            user_act.acts[0].state != "COMPLETED"
          )
            throw new Error("Act is disabled");
      }
    }

    //If this act has been deleted
    //Only admins and users who have completed it can view it

    if (act.deleted == true) {
      let display_act = false;
      if (req.roles && req.roles.administrator) {
        display_act = true;
      } else if (user_act && user_act.acts[0].state == "COMPLETED") {
        display_act = true;
      }
      if (!display_act) {
        throw new Error("Act has been deleted");
      }
    }

    res.json({ act, user: req.user, proofs: user_act, roles: req.roles });
  } catch (err) {
    next(createError(400, err.message));
  }
});

router.put("/:id/enable/:state", async function(req, res, next) {
  //Only managers and admins can get here
  //Change the state of the act accordingly
  try {
    if (!req.roles || !req.roles.manager)
      throw new Error("You do not have authorization");

    const act = await Act.findById(req.params.id);
    if (act.deleted) throw new Error("Act does not exist");

    if (req.params.state !== "true" && req.params.state !== "false")
      throw new Error("Invalid state");

    await Act.findByIdAndUpdate(req.params.id, {
      "enabled.state": req.params.state
    });
    res.json({ message: "Success" });
  } catch (err) {
    next(createError(400, err.message));
  }
});

//Show acts
router.get("/", async function(req, res, next) {
  try {
    if (!req.user) {
      throw new Error("You do not have authorization");
    }
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
      //Only return acts this user has not completed
      search["users_under_review.id"] = { $not: { $eq: req.user.id } };
      search["completed_users.id"] = { $not: { $eq: req.user.id } };
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

    //For some unknown reason, the below command gives this error: Projection cannot have a mix of inclusion and exclusion.
    // const promised_acts = Act.find(search, { users_who_clicked_on_this_act: false, users_who_completed_this_act: false }).sort({ [sort]: order }).skip(offset).limit(10).lean();
    const promised_acts = Act.find(search)
      .sort({ [sort]: order })
      .skip(offset)
      .limit(10)
      .lean();
    const promised_count = Act.find(search).countDocuments();
    const promised_user_reward_points = User.findById(req.user.id, {
      points: true,
      _id: false
    });

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
    // const lower_date = `${this_year}-${this_month}-1`;
    // const upper_date = `${next_year}-${next_month}-1`;

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
      promised_user_reward_points,
      promised_best_acts_for_this_month
    ];
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
      best_acts = values[3];
    });
    const act_count = count;
    count = Math.ceil(count / 10);
    const total = [];
    for (let i = 0; i < count; i++) total.push(1);
    // acts.forEach(element => {
    //     if (!element.image)
    //         element.image = process.env.website + 'images/banner1.jpg';
    // });
    let current_page = process.env.website + "acts?";

    if (!req.query.page) req.query.page = 1;

    //Loop through the query parameters and append them to the url;
    if (req.query.search)
      current_page = current_page + "search=" + req.query.search + "&";
    if (req.query.sort)
      current_page = current_page + "sort=" + req.query.sort + "&";
    if (req.query.order)
      current_page = current_page + "order=" + req.query.order + "&";

    // res.cookie('type', type, { maxAge: 3600000 })
    // if (!req.query.type)
    //     req.query.type = type

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

    // res.render('acts', { type, current_page, query: req.query, count, title: "Acts", acts, total_acts: total, user: req.user, roles: req.roles });
  } catch (err) {
    console.log(err);
    next(createError(400, err.message));
  }
});

//Create act
router.post("/:type", async function(req, res, next) {
  try {
    if (!req.roles || !req.roles.act_poster) {
      throw new Error("You do not have authorization");
    }
    // if (req.file)
    //     req.body.picture = './tmp/' + req.file.filename
    req.body.provider = req.user;
    let act;
    if (req.params.type == "act") act = await Act.initialize(req.body);
    //Handling events
    else if (req.params.type == "event") {
      if (!req.body.start_time || !req.body.end_time)
        throw new Error("Incomplete request");

      // console.log(req.body);
      if (moment(req.body.end_time).isBefore(req.body.start_time))
        throw new Error("Start time must be before end time");

      act = await Event_Act.initialize(req.body);
      act.start_time = req.body.start_time;
      act.end_time = req.body.end_time;
    }

    //Check if there is a tag
    //If there is,
    if (req.body.tags) {
      //Split into array by space delimiter
      req.body.tags = req.body.tags.toLowerCase();
      let tags = req.body.tags.split(" ");
      tags = tags.filter(onlyUnique);
      const act_tags = [];
      //Check if each tag exists
      const promises = [];
      tags.forEach(element => {
        if (!element) return;
        promises.push(Tag.create({ name: element }, function(err, res) {}));
        //Create array of tags
        act_tags.push({ name: element });
      });
      await Promise.all(promises);
      //Attach tags to this act
      act.tags = act_tags;
    }

    if (req.roles.administrator) act.enabled.state = true;

    await act.save();
    // user = user.toObject();
    // delete user.password;
    // res.redirect('/acts?success=Success');
    res.json({ message: "Success" });
  } catch (err) {
    next(createError(400, err.message));
  }
});
// finally {
//   //Delete uploaded file
//   if (req.file)
//     fs.unlinkSync(req.body.profile_picture);
// }

//Edit act
router.put("/:id", async function(req, res, next) {
  try {
    // console.log(req.body);
    if (!req.roles || !req.roles.act_poster) {
      throw new Error("You do not have authorization");
    }

    //If this is not the admin
    if (!req.roles.administrator) {
      //Check if this act poster uploaded this act
      const this_act = await Act.findOne({
        _id: req.params.id,
        "act_provider.id": req.user.id
      });
      //If not, return error
      if (!this_act) throw new Error("You do not have authorization");

      //If the act is deleted, return error
      if (this_act.deleted) throw new Error("Act does not exist");
    }

    //Make sure all details were sent
    if (!req.body.name || !req.body.description || !req.body.reward_points)
      throw new Error("Incomplete request");

    const name = sanitize(req.body.name);
    const description = sanitize(req.body.description);
    const reward_points = sanitize(req.body.reward_points);

    if (!name || !description || !reward_points)
      throw new Error("Incomplete request");

    let act = await Act.findById(req.params.id);
    //Only the admin or act poster who uploaded this act can alter it
    if (!req.roles.administrator && req.user.id != act.act_provider.id)
      throw new Error("You do not have authorization");

    if (!req.roles.administrator) act.enabled.state = false;
    act.name = name;
    act.description = description;
    act.reward_points = reward_points;

    //If this is an event
    if (act.__t == "Event") {
      //Make sure all fields were sent
      if (!req.body.start_time || !req.body.end_time)
        throw new Error("Incomplete request");

      const start_time = sanitize(req.body.start_time);
      const end_time = sanitize(req.body.end_time);

      if (!start_time || !end_time) throw new Error("Incomplete request");

      //Make sure start time is before end time
      if (moment(req.body.end_time).isBefore(req.body.start_time))
        throw new Error("Start time must be before end time");

      //Attach new values to it
      act.start_time = start_time;
      act.end_time = end_time;
    }

    await act.save();

    //Check if there is a tag
    //If there is,
    if (req.body.tags) {
      req.body.tags = req.body.tags.toLowerCase();
      //Split into array by space delimiter
      let tags = req.body.tags.split(" ");
      tags = tags.filter(onlyUnique);
      const act_tags = [];
      //Check if each tag exists
      const promises = [];
      tags.forEach(element => {
        if (!element) return;
        promises.push(Tag.create({ name: element }, function(err, res) {}));
        promises.push(
          Act.findOneAndUpdate(
            {
              _id: act._id,
              "tags.name": { $ne: element }
            },
            { $addToSet: { tags: { name: element } } },
            function(err, res) {}
          )
        );
      });
      await Promise.all(promises);
    }

    act = await Act.findById(act._id);

    res.json(act);
    // res.json(await Act.findById(req.params.id));
  } catch (err) {
    next(createError(400, err.message));
  }
});

//Change act state
router.put("/:id/state", async function(req, res, next) {
  try {
    if (!req.roles || !req.roles.act_poster) {
      throw new Error("You do not have authorization");
    }

    const act = await Act.findById(req.params.id);

    //Only an admin or the act poster who uploaded this act can change its state
    if (!req.roles.administrator) {
      if (act.act_provider.id != req.user.id)
        throw new Error("You do not have authorization");
    }

    //If act does not exist, error
    //If act is deleted, give error
    if (!act || act.deleted) throw new Error("Act does not exist");

    let new_state;

    if (act.state == "AVAILABLE") new_state = "NOT_AVAILABLE";
    else new_state = "AVAILABLE";

    //Only the admin or act poster who uploaded this act can alter it
    if (!req.roles.administrator && req.user.id != act.act_provider.id)
      throw new Error("You do not have authorization");

    act.state = new_state;
    await act.save();

    res.json({ message: "Success" });
  } catch (err) {
    next(createError(400, err.message));
  }
});

//Delete act
router.put("/:id/delete", async function(req, res, next) {
  try {
    if (!req.roles || !req.roles.act_poster) {
      throw new Error("You do not have authorization");
    }

    const act = await Act.findById(req.params.id);

    //Only the admin or act poster who uploaded this act can delete it
    if (!req.roles.administrator && req.user.id != act.act_provider.id)
      throw new Error("You do not have authorization");

    //Deleted acts can't be deleted again
    if (act.deleted) throw new Error("Non existent act");

    act.deleted = true;
    await act.save();

    res.json({ message: "Success" });
  } catch (err) {
    next(createError(400, err.message));
  }
});

//Delete act proof
router.delete("/proof/:new_name", async function(req, res, next) {
  const new_name = atob(req.params.new_name);
  const session = await mongoose.startSession();
  try {
    //Only admins and the person who uploaded the proof can delete it
    const user = await User.findOne({
      "acts.proof_of_completion.new_name": new_name
    });
    if (!req.user) throw new Error("You do not have authorization");
    if (!req.roles.administrator && user._id != req.user.id)
      throw new Error("You do not have authorization");

    // await User.findOneAndUpdate(
    //   { "acts.proof_of_completion.new_name": new_name },
    //   { $pull: { "acts.$.proof_of_completion": { new_name: new_name } } }
    // )
    // res.json({message: "Success"});

    const promises = [];
    session.startTransaction();
    //Delete the proof from the act object
    //Remove from users who have completed this act
    //Remove from users under review and rejected users
    const promised_delete_proof_from_act = Act.findOneAndUpdate(
      { "users_who_completed_this_act.proof_of_completion.new_name": new_name },
      {
        $pull: {
          "users_who_completed_this_act.$.proof_of_completion": {
            new_name: new_name
          },
          "rejected_users.$.proof_of_completion": { new_name: new_name },
          "users_under_review.$.proof_of_completion": { new_name: new_name }
        }
      },
      { session }
    );
    //Delete the proof from the user object
    const promised_delete_proof_from_user = User.findOneAndUpdate(
      { "acts.proof_of_completion.new_name": new_name },
      { $pull: { "acts.$.proof_of_completion": { new_name: new_name } } },
      { session }
    );
    //Delete the proof file
    const previous_image =
      process.env.act_picture_folder +
      new_name.replace(
        process.env.website + process.env.display_act_picture_folder,
        ""
      );
    const promised_delete_file = fs_delete_file(previous_image);

    promises.push(promised_delete_proof_from_act);
    promises.push(promised_delete_proof_from_user);
    promises.push(promised_delete_file);

    await Promise.all(promises);
    await session.commitTransaction();
    //Return success
    res.json({ message: "Success" });
  } catch (err) {
    await session.abortTransaction();
    next(createError(400, err.message));
  } finally {
    session.endSession();
  }
});

//Delete act tag
router.delete("/:act_id/tag/:tag_id", async function(req, res, next) {
  try {
    if (!req.roles || !req.roles.act_poster)
      throw new Error("You do not have authorization");

    //If this isn't the admin
    if (!req.roles.administrator) {
      //And it's a different act provider than the one who created the act
      //Give error
      const this_act = await Act.findOne({
        _id: req.params.act_id,
        "act_provider.id": req.user.id
      });
      if (!this_act) throw new Error("You do not have authorization");

      if (this_act.deleted) throw new Error("Act does not exist");
    }

    //Delete the tag from this act where _id is given
    await Act.findByIdAndUpdate(req.params.act_id, {
      $pull: { tags: { _id: req.params.tag_id } }
    });
    res.json({ message: "Success" });
  } catch (err) {
    next(createError(400, err.message));
  }
});

module.exports = router;
