const { Router } = require("express");
const User = require("../../models/User");
const globals = require("../../globals");
const Act = require("../../models/Act");
const Tag = require("../../models/Tag");
const FileSchema = require("../../models/File");
const Event_Act = require("../../models/Event");
var createError = require("http-errors");
const multer = require("multer");
const mongoose = require("mongoose");
const fs = require("fs");
const uuidv4 = require("uuid/v4");
const base64Img = require("base64-img-promise");
const sharp = require("sharp");
const sanitize = require("sanitize-html");
const util = require("util");
const cheerio = require("cheerio");
const fs_read_file = util.promisify(fs.readFile);
const fs_delete_file = util.promisify(fs.unlink);
const mv = require("mv");
const fs_rename_file = util.promisify(mv);
const mail = require("../../send_mail");
const logger = require("../../logger").winston;
const os = require("os");
const moment = require("moment");
sanitize.defaults.allowedAttributes = [];
sanitize.defaults.allowedTags = [];
var upload = multer({
  dest: os.tmpdir(),
  limits: { fieldSize: 25 * 1024 * 1024 * 1024 }
});

const router = Router();

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function uploadMultipleFiles(re, original_name, file_name, size, req) {
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
        `${os.tmpdir()}/${file_name}`,
        `${process.env.files_folder}/${unique_name}${ext}`
      );
    })
    .then(function() {
      //Save the new file name and the uploaded file name
      if (!req.user.proof_of_completion) req.user.proof_of_completion = [];
      req.user.proof_of_completion.push({
        original_name: original_name,
        size,
        new_name: unique_name + ext
      });
    });
}

//Approve user act proof
router.put("/:act_id/user/:user_id/approve", async function(req, res, next) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let promises = [];
    // const user = await User.findById(req.params.user_id)
    const promised_user = User.findOne(
      {
        _id: req.params.user_id,
        "acts.id": req.params.act_id,
        "acts.state": "UNDER_REVIEW"
      },
      { "acts.$": true, first_name: true, last_name: true, email: true }
    ).lean();
    const promised_act = Act.findById(req.params.act_id);

    let user, act;
    promises = [promised_user, promised_act];
    await Promise.all(promises).then(function(values) {
      user = values[0];
      act = values[1];
    });

    if (act.amount == 0) throw new Error("Act is not available");

    //Make act unavailable if amount is == 1
    if (act.amount == 1)
      await Act.findByIdAndUpdate(req.params.act_id, {
        state: "NOT_AVAILABLE"
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
        //Decrease number of users who can complete it
        $inc: { total_number_of_completions: 1, amount: -1 }
      },
      { session }
    );

    const promised_user_change = User.findOneAndUpdate(
      {
        _id: req.params.user_id,
        "acts.id": req.params.act_id,
        "acts.state": "UNDER_REVIEW"
      },
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

    logger.info(`${user.email} act was approved actID: ${act._id}`);
    res.json({ message: "Success" });
  } catch (err) {
    await session.abortTransaction();
    next(createError(400, err.message));
    logger.error(`${user.email} act failed to be approved actID: ${act._id}`);
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
      {
        _id: req.params.user_id,
        "acts.id": req.params.act_id,
        "acts.state": "UNDER_REVIEW"
      },
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
      {
        _id: req.params.user_id,
        "acts.id": req.params.act_id,
        "acts.state": "UNDER_REVIEW"
      },
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
    logger.info(`${user.email} act was disapproved actID: ${act._id}`);
    res.json({ message: "Success" });
  } catch (err) {
    await session.abortTransaction();
    next(createError(400, err.message));
    logger.error(
      `${user.email} act failed to be disapproved actID: ${act._id}`
    );
  } finally {
    session.endSession();
  }
});

//Show users relationships with act
router.get("/:id/details", async function(req, res, next) {
  try {
    let page = parseInt(sanitize(req.query.page));
    let offset = (page - 1) * 10;

    results = Act.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
      { $unwind: "$completed_users" },
      {
        $match: {
          "completed_users.user_review_of_act.act_rating": { $exists: true }
        }
      },
      { $project: { completed_users: true } },
      { $sort: { "completed_users.user_review_of_act.time": -1 } },
      { $skip: offset },
      { $limit: 10 },
      {
        $group: {
          _id: null,
          reviews: { $push: "$completed_users" }
        }
      },
      { $project: { _id: false } }
    ]);

    count = Act.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
      { $unwind: "$completed_users" },
      {
        $match: {
          "completed_users.user_review_of_act.act_rating": { $exists: true }
        }
      },
      { $project: { completed_users: true } },
      { $sort: { "completed_users.user_review_of_act.time": -1 } },
      { $count: "count" }
    ]);

    const promises = [results, count];
    // let results, count, points
    let returned_results, pages, sum;
    await Promise.all(promises).then(function(values) {
      if (values[0][0]) returned_results = values[0][0].reviews;
      else returned_results = [];
      if (values[1][0]) count = values[1][0].count;
      else count = 0;
      pages = Math.ceil(count / 10);
    });
    logger.info(
      `${req.user.id} successfully got act ${req.params.id} relationships`
    );
    res.json({
      data: returned_results,
      count: pages,
      roles: req.roles
    });
  } catch (err) {
    next(createError(400, err.message));
    logger.error(
      `${req.user.id} failed to get act ${req.params.id} relationships`
    );
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
  session.startTransaction();
  try {
    //Non logged in users can't access this endpoint
    if (!req.user) throw new Error(res.__("lack_auth"));

    const this_user = await User.findById(req.user.id);
    //Debugging purposes
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
      throw new Error(res.__("no_files"));

    //Get unique names for each file upload
    let promises = [];
    for (let i = 0; i < req.files.length; i++)
      promises.push(
        uploadMultipleFiles(
          re,
          req.files[i].originalname,
          req.files[i].filename,
          req.files[i].size,
          req
        )
      );

    await Promise.all(promises);

    //Get user's relationship with this act
    const act_user_relationship = await Act.aggregate([
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
      { $project: { users_who_completed_this_act: 1, repeatable: 1 } }
    ]);

    //Save changes in the database
    //return json of all proofs for this act for this person
    // Update the act and the user
    promises = [];
    const user = req.user;
    user.state = "UNDER_REVIEW";

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
      { $project: { users_who_completed_this_act: 1, repeatable: 1 } }
    ])
      .session(session)
      .then(async function(act) {
        //Check if it's under review
        //If this act is not under review for this user
        //If this act is not completed by this user (If non repeatable)
        //If this act is repeatable and completed by this user
        if (
          !act[0] ||
          (act[0].users_who_completed_this_act.state == "COMPLETED" &&
            act[0].repeatable)
          // ||
          // act[0].users_who_completed_this_act.state != "UNDER_REVIEW"
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
        } else if (
          act[0] &&
          act[0].users_who_completed_this_act.state == "REJECTED"
        ) {
          //If it was rejected
          //Get previous proofs
          let prev_proofs = await User.findOne(
            { "acts.id": req.params.id },
            { "acts.$": true, _id: false }
          ).lean();
          prev_proofs = prev_proofs.acts[0];
          delete prev_proofs._id;
          prev_proofs.id = req.user.id;
          //Add this new proof to it
          prev_proofs.proof_of_completion = prev_proofs.proof_of_completion.concat(
            user.proof_of_completion
          );
          //Make state under review
          prev_proofs.state = "UNDER_REVIEW";
          prev_proofs.first_name = user.first_name;
          prev_proofs.last_name = user.last_name;
          prev_proofs.review_of_proof = user.review_of_proof;
          //Place a new user with these details in Users who have completed array
          await Act.findByIdAndUpdate(
            req.params.id,
            {
              $push: {
                users_who_completed_this_act: prev_proofs
              }
            },
            { session }
          );
          //Add this user to users under review array
          await Act.findByIdAndUpdate(
            req.params.id,
            {
              $push: {
                users_under_review: prev_proofs
              },
              //Remove this user from the users who were rejected
              $pull: {
                rejected_users: { id: mongoose.Types.ObjectId(req.user.id) }
              }
            },
            { session }
          );
        }
        //If it's under review
        else if (
          act[0] &&
          act[0].users_who_completed_this_act.state == "UNDER_REVIEW"
        ) {
          await Act.findOneAndUpdate(
            {
              "users_who_completed_this_act._id":
                act[0].users_who_completed_this_act._id
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
            {
              $and: [
                { _id: req.params.id },
                {
                  "users_under_review.id":
                    act[0].users_who_completed_this_act.id
                }
              ]
            },
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

    let promised_user_change;

    //If this act has been completed/ is under review by this user
    //And this act is repeatable
    if (
      ((act_user_relationship[0] &&
        act_user_relationship[0].users_who_completed_this_act.state ==
          "COMPLETED") ||
        (act_user_relationship[0] &&
          act_user_relationship[0].users_who_completed_this_act.state ==
            "UNDER_REVIEW")) &&
      this_act.repeatable
    ) {
      //If this act is already in review
      if (
        act_user_relationship[0].users_who_completed_this_act.state ==
        "UNDER_REVIEW"
      ) {
        //Find the specific entry and add these proofs to it
        //Add to the entry where it's under review
        promised_user_change = User.findOneAndUpdate(
          {
            _id: mongoose.Types.ObjectId(user.id),
            acts: {
              $elemMatch: {
                id: mongoose.Types.ObjectId(req.params.id),
                state: "UNDER_REVIEW"
              }
            }
          },
          {
            $set: { "acts.$.state": "UNDER_REVIEW", "acts.$.time": Date.now() },
            $addToSet: {
              "acts.$.proof_of_completion": user.proof_of_completion
            }
          },
          { session }
        );
      }

      //If this act is not in review (Completed)
      //Add these proofs to it and set it as under review
      else if (
        act_user_relationship[0].users_who_completed_this_act.state ==
        "COMPLETED"
      ) {
        promised_user_change = User.findOneAndUpdate(
          { _id: user.id },
          { $push: { acts: act } },
          { session }
        );
      }
    }

    //If this act has not been completed by this user
    //do what you've been doing all this time
    else if (
      !act_user_relationship[0] ||
      act_user_relationship[0].users_who_completed_this_act.state != "COMPLETED"
    ) {
      promised_user_change = User.findOneAndUpdate(
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
    }

    const file_details = [];
    for (let i = 0; i < req.user.proof_of_completion.length; i++) {
      file_details.push({
        uploader_id: this_user._id,
        proof_name: req.user.proof_of_completion[i].new_name,
        original_name: req.user.proof_of_completion[i].original_name,
        size: req.user.proof_of_completion[i].size
      });
    }

    const promised_fileschema_insert = FileSchema.collection.insertMany(
      file_details,
      { session }
    );

    promises.push(
      promised_act_change,
      promised_user_change,
      promised_fileschema_insert
    );
    await Promise.all(promises);

    // //Redirect to calling page with success message
    // res.redirect(url.parse(req.headers.referer).pathname + '?Success=' + 'Success');

    //Return only the new uploads
    await session.commitTransaction();
    //Get all proofs for this act
    const act_proofs = await User.findOne(
      {
        _id: req.user.id,
        acts: {
          $elemMatch: {
            id: mongoose.Types.ObjectId(req.params.id),
            state: "UNDER_REVIEW"
          }
        }
      },
      { "acts.$.proof_of_completion": true, _id: false },
      { sort: { "acts.time": -1 } }
    );
    // console.log(act_proofs.acts[0].proof_of_completion);
    res.json(act_proofs.acts[0].proof_of_completion);
    logger.info(`${req.user.id} successfully uploaded proof of completion`);
  } catch (err) {
    logger.error(`${req.user.id} failed to upload proof of completion`);
    //Delete uploaded files
    const this_promises = [];
    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        if (fs.existsSync(os.tmpdir() + "/" + req.files[i].filename))
          this_promises.push(
            fs_delete_file(os.tmpdir() + "/" + req.files[i].filename)
          );
      }
      await Promise.all(this_promises);
    }
    await session.abortTransaction();
    next(createError(400, err.message));
  } finally {
    session.endSession();
  }
});

//Review completed act
router.put("/:id/review", async function(req, res, next) {
  try {
    const user_review_of_act = {
      act_rating: parseInt(req.body.reward_rating),
      act_comments: req.body.reward_comments,
      time: Date.now()
    };

    await Act.findOneAndUpdate(
      { "completed_users._id": mongoose.Types.ObjectId(req.params.id) },
      { $set: { "completed_users.$.user_review_of_act": user_review_of_act } }
    );

    logger.info(`${req.user.id} successfully reviewed act ${req.params.id}`);
    //Return success message
    res.json({ message: "Success" });
  } catch (err) {
    next(createError(400, err.message));
    logger.error(`${req.user.id} failed to review act ${req.params.id}`);
  }
});

//Get act image
router.get("/:id/image", async function(req, res, next) {
  try {
    const act_image = await Act.findById(req.params.id, {
      _id: false,
      image: true
    });
    logger.info("Success in getting act " + req.params.id + " image");
    res.sendFile(`${process.env.files_folder}/${act_image.image}`);
  } catch (err) {
    next(createError(400, err.message));
    logger.error(
      req.user.id + " failed to get act " + req.params.id + " image"
    );
  }
});

//Get act image
router.get("/images/:id", async function(req, res, next) {
  try {
    res.sendFile(`${process.env.files_folder}/${req.params.id}`);
    logger.info(`${req.user.id} successfully got act ${req.params.id} image`);
  } catch (err) {
    next(createError(400, err.message));
    logger.error(`${req.user.id} failed to get act ${req.params.id} image`);
  }
});

//Get events
router.get("/calendar", async function(req, res, next) {
  //Get all events in the range
  today = new Date();
  const todays_date = `${today.getFullYear()}-${today.getMonth() +
    1}-${today.getDate()}`;
  const events = await Event_Act.find(
    {
      start_time: { $gte: req.query.start },
      end_time: { $lte: req.query.end },
      end_time: { $gte: todays_date },
      deleted: false,
      state: "AVAILABLE",
      "enabled.state": true
    },
    { name: 1, start_time: 1, end_time: 1 }
  ).lean();

  events.forEach(element => {
    element.title = element.name;
    element.start = element.start_time + "Z";
    element.end = element.end_time + "Z";
    element.url = `acts/${element._id}`;
  });

  res.json(events);
});

//Get individual act proof
router.get("/proof/:id", async function(req, res, next) {
  try {
    //Check to make sure this is the person who uploaded the proof
    const act_proof = await User.aggregate([
      {
        $match: {
          "acts.proof_of_completion._id": mongoose.Types.ObjectId(req.params.id)
        }
      },
      { $unwind: "$acts" },
      {
        $match: {
          "acts.proof_of_completion._id": mongoose.Types.ObjectId(req.params.id)
        }
      },
      { $unwind: "$acts.proof_of_completion" },
      {
        $match: {
          "acts.proof_of_completion._id": mongoose.Types.ObjectId(req.params.id)
        }
      },
      {
        $project: {
          "acts.proof_of_completion.new_name": true,
          "acts.proof_of_completion.original_name": true
        }
      }
    ]);
    //If not, error
    if (act_proof[0]._id != req.user.id)
      throw new Error("You do not have authorization");
    const new_name = act_proof[0].acts.proof_of_completion.new_name;
    const original_name = act_proof[0].acts.proof_of_completion.original_name;
    const file_location = new_name.replace(`${process.env.website}`, "");
    //Else,
    //return proof
    logger.info(`${req.user.id} successfully got act proof ${req.params.id}`);
    res.sendFile(`${process.env.files_folder}/${new_name}`);
  } catch (err) {
    next(createError(400, err.message));
    logger.error(`${req.user.id} failed to get act proof ${req.params.id}`);
  }
});

//Get individual act proof by admin
router.get("/admin_proof/:id", async function(req, res, next) {
  try {
    //Check to make sure this is the person who uploaded the proof
    const act_proof = await User.aggregate([
      {
        $match: {
          "acts.proof_of_completion._id": mongoose.Types.ObjectId(req.params.id)
        }
      },
      {
        $project: {
          "acts.proof_of_completion.new_name": true,
          "acts.proof_of_completion.original_name": true
        }
      }
    ]);
    //If not, error

    const new_name = act_proof[0].acts[0].proof_of_completion[0].new_name;
    //Else,
    //return proof
    logger.info(`${req.user.id} successfully got act proof ${req.params.id}`);
    res.sendFile(`${process.env.files_folder}/${new_name}`);
  } catch (err) {
    next(createError(400, err.message));
    logger.error(`${req.user.id} failed to get act proof ${req.params.id}`);
  }
});

//Get individual act proof by manager
router.get("/manage_proof/:id", async function(req, res, next) {
  try {
    //Check to make sure this is a manager
    if (!req.roles || !req.roles.manager)
      throw new Error("You do not have authorization");
    const act_proof = await Act.aggregate([
      {
        $match: {
          "users_under_review.proof_of_completion._id": mongoose.Types.ObjectId(
            req.params.id
          )
        }
      },
      { $unwind: "$users_under_review" },
      {
        $match: {
          "users_under_review.proof_of_completion._id": mongoose.Types.ObjectId(
            req.params.id
          )
        }
      },
      { $unwind: "$users_under_review.proof_of_completion" },
      {
        $match: {
          "users_under_review.proof_of_completion._id": mongoose.Types.ObjectId(
            req.params.id
          )
        }
      },
      {
        $project: {
          "users_under_review.proof_of_completion.new_name": true,
          "users_under_review.proof_of_completion.original_name": true
        }
      }
    ]);
    //If not, error

    const new_name =
      act_proof[0].users_under_review.proof_of_completion.new_name;
    const original_name =
      act_proof[0].users_under_review.proof_of_completion.original_name;
    const file_location = new_name.replace(`${process.env.website}`, "");
    //Else,
    //return proof
    logger.info(`${req.user.id} successfully got act proof ${req.params.id}`);
    res.sendFile(`${process.env.files_folder}/${new_name}`);
  } catch (err) {
    next(createError(400, err.message));
    logger.error(`${req.user.id} failed to get act proof ${req.params.id}`);
  }
});

router.delete("/:id/image", async function(req, res, next) {
  try {
    const promises = [];
    const act = await Act.findById(req.params.id, { image: true, _id: false });
    //Delete image from file system
    promises.push(fs_delete_file(`${process.env.files_folder}/${act.image}`));
    //Delete image from act and file tables
    promises.push(
      Act.findByIdAndUpdate(req.params.id, { $unset: { image: "" } })
    );
    promises.push(FileSchema.findOneAndDelete({ proof_name: act.image }));
    await Promise.all(promises);
    //Return success message
    logger.info(
      `${req.user.id} successfully deleted act ${req.params.id} image`
    );
    res.json({ message: "Success" });
  } catch (err) {
    next(createError(400, err.message));
    logger.error(`${req.user.id} failed to delete act ${req.params.id} image`);
  }
});

//Get individual act
router.get("/:id", async function(req, res, next) {
  //Get act from Act table
  //Get user's relationship with act from user table
  //Combine and deliver

  try {
    //Only logged in users can view act
    if (!req.user) throw new Error(res.__("lack_auth"));

    const promised_act = Act.findById(
      req.params.id,
      "act_provider importance repeatable deleted how_to_submit_evidences start_time amount expiration_date end_time image description tags enabled name reward_points state total_number_of_clicks total_number_of_completions"
    ).lean();

    const promised_user = User.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(req.user.id) }
      },
      {
        $unwind: "$acts"
      },
      {
        $match: { "acts.id": mongoose.Types.ObjectId(req.params.id) }
      },
      {
        $sort: { "acts.time": -1 }
      },
      {
        $limit: 1
      },
      {
        $project: { acts: 1 }
      }
    ]);

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

    if (user_act[0]) {
      let x;
      x = user_act[0].acts;
      user_act[0].acts = [x];
      user_act = user_act[0];
    } else {
      user_act = user_act[0];
    }

    //If act does not exist, error
    if (!act) throw new Error(res.__("act_does_not_exist"));

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
        throw new Error(res.__("act_is_not_available"));
      if (user_act)
        if (
          act.state == "NOT_AVAILABLE" &&
          user_act.acts[0].state != "COMPLETED"
        )
          throw new Error(res.__("act_is_not_available"));
      //If act is disabled and available
      //And this is a manager
      if (req.roles && req.roles.manager) {
        //Return the act
      } else {
        if (act.enabled.state == false && !user_act)
          throw new Error(res.__("act_is_disabled"));
        if (user_act)
          if (
            act.enabled.state == false &&
            user_act.acts[0].state != "COMPLETED"
          )
            throw new Error(res.__("act_is_disabled"));
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
        throw new Error(res.__("act_has_been_deleted"));
      }
    }

    //If user has completed this act and it is repeatable
    //Act should behave like the user has not completed it before
    if (user_act && user_act.acts[0].state == "COMPLETED" && act.repeatable)
      user_act = null;

    logger.info(`${req.user.id} successfully got act ${req.params.id}`);
    res.json({ act, user: req.user, proofs: user_act, roles: req.roles });
  } catch (err) {
    next(createError(400, err.message));
    logger.error(`${req.user.id} failed to get act ${req.params.id}`);
  }
});

//Get individual completed act
router.get("/:id/complete", async function(req, res, next) {
  //Get act from Act table
  //Get user's relationship with act from user table
  //Combine and deliver

  try {
    //Only logged in users can view act
    if (!req.user) throw new Error(res.__("lack_auth"));

    const promised_act = Act.findOne(
      { "completed_users._id": req.params.id },
      "act_provider repeatable deleted how_to_submit_evidences start_time amount expiration_date end_time image description tags enabled name reward_points state total_number_of_clicks total_number_of_completions"
    ).lean();

    const promised_user = Act.findOne(
      { "completed_users._id": req.params.id },
      { "completed_users.$": true, _id: false }
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
    if (!act) throw new Error(res.__("act_does_not_exist"));

    // //If this request is coming from the act poster who uploaded it or an admin
    // //Return the act
    // let creator_rights = false;
    // if (req.roles && req.roles.act_poster) {
    //   if (req.roles.administrator || act.act_provider.id == req.user.id)
    //     creator_rights = true;
    // }
    // if (!creator_rights) {
    //   //If this act is unavailable and this user has not completed it and this person doesn't have creator rights (Rightful act poster or admin)
    //   if (act.state == "NOT_AVAILABLE" && !user_act)
    //     throw new Error(res.__("act_is_not_available"));
    //   if (user_act)
    //     if (
    //       act.state == "NOT_AVAILABLE" &&
    //       user_act.acts[0].state != "COMPLETED"
    //     )
    //       throw new Error(res.__("act_is_not_available"));
    //   //If act is disabled and available
    //   //And this is a manager
    //   if (req.roles && req.roles.manager) {
    //     //Return the act
    //   } else {
    //     if (act.enabled.state == false && !user_act)
    //       throw new Error(res.__("act_is_disabled"));
    //     if (user_act)
    //       if (
    //         act.enabled.state == false &&
    //         user_act.acts[0].state != "COMPLETED"
    //       )
    //         throw new Error(res.__("act_is_disabled"));
    //   }
    // }

    //If this act has been deleted
    //Only admins and users who have completed it can view it

    // if (act.deleted == true) {
    //   let display_act = false;
    //   if (req.roles && req.roles.administrator) {
    //     display_act = true;
    //   } else if (user_act && user_act.acts[0].state == "COMPLETED") {
    //     display_act = true;
    //   }
    //   if (!display_act) {
    //     throw new Error(res.__("act_has_been_deleted"));
    //   }
    // }

    // //If user has completed this act and it is repeatable
    // //Act should behave like the user has not completed it before
    // if (user_act && user_act.acts[0].state == "COMPLETED" && act.repeatable)
    //   user_act = null;

    logger.info(
      `${req.user.id} successfully got completed act ${req.params.id}`
    );
    res.json({ act, user: req.user, proofs: user_act, roles: req.roles });
  } catch (err) {
    next(createError(400, err.message));
    logger.error(`${req.user.id} failed to get completed act ${req.params.id}`);
  }
});

router.put("/:id/enable/:state", async function(req, res, next) {
  //Only managers and admins can get here
  //Change the state of the act accordingly
  try {
    if (!req.roles || !req.roles.manager) throw new Error(res.__("lack_auth"));

    const act = await Act.findById(req.params.id);
    if (act.deleted) throw new Error(res.__("act_does_not_exist"));

    if (req.params.state !== "true" && req.params.state !== "false")
      throw new Error(res.__("invalid_state"));

    await Act.findByIdAndUpdate(req.params.id, {
      "enabled.state": req.params.state
    });
    logger.info(
      `${req.user.id} successfully altered act ${req.params.id} state`
    );
    res.json({ message: "Success" });
  } catch (err) {
    next(createError(400, err.message));
    logger.error(`${req.user.id} failed to alter act ${req.params.id} state`);
  }
});

//Show acts
router.get("/", async function(req, res, next) {
  try {
    if (!req.user) {
      throw new Error(res.__("lack_auth"));
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
      //Return completed acts only if the act is repeatable
      search["users_under_review.id"] = { $not: { $eq: req.user.id } };
      search["$or"] = [
        { "completed_users.id": { $not: { $eq: req.user.id } } },
        { repeatable: true }
      ];
      // search["completed_users.id"] = { $not: { $eq: req.user.id } };
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
      best_acts = values[3];
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

    logger.info(`User ${req.user.id} successfully got acts`);
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
    logger.error(`User ${req.user.id} failed to get acts`);
    next(createError(400, err.message));
  }
});

//Create act
router.post("/:type", upload.single("file"), async function(req, res, next) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    if (!req.roles || !req.roles.act_poster) {
      throw new Error(res.__("lack_auth"));
    }
    if (req.file) req.body.picture = os.tmpdir() + "/" + req.file.filename;
    req.body.provider = req.user;
    const this_user = await User.findById(req.user.id, { email: true });
    req.body.provider.email = this_user.email;
    let act;
    if (req.params.type == "act") act = await Act.initialize(req.body);
    //Handling events
    else if (req.params.type == "event") {
      if (!req.body.start_time || !req.body.end_time)
        throw new Error(res.__("incomplete_request"));

      // console.log(req.body);
      if (moment(req.body.end_time).isBefore(req.body.start_time))
        throw new Error(res.__("start_before_end"));

      act = await Event_Act.initialize(req.body);
      act.start_time = req.body.start_time;
      act.end_time = req.body.end_time;
    }

    if (req.file) {
      const file_object = {
        uploader_id: mongoose.Types.ObjectId(req.user.id),
        proof_name: act.image,
        original_name: req.file.originalname,
        size: req.file.size
      };

      await FileSchema.create(file_object);
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

    await session.commitTransaction();
    logger.info(`${req.user.id} successfully created ${act._id}`);
    res.json(act);
  } catch (err) {
    await session.abortTransaction();
    next(createError(400, err.message));
    logger.error(`${req.user.id} failed to create act`);
  } finally {
    //Delete uploaded file
    session.endSession();
    // console.log(req.body.picture);
    if (req.file) fs.unlinkSync(req.body.picture);
  }
});

//Edit act
router.put("/:id", upload.single("file"), async function(req, res, next) {
  try {
    // console.log(req.body);
    if (!req.roles || !req.roles.act_poster) {
      throw new Error(res.__("lack_auth"));
    }

    //If this is not the admin
    if (!req.roles.administrator) {
      //Check if this act poster uploaded this act
      const this_act = await Act.findOne({
        _id: req.params.id,
        "act_provider.id": req.user.id
      });
      //If not, return error
      if (!this_act) throw new Error(res.__("lack_auth"));

      //If the act is deleted, return error
      if (this_act.deleted) throw new Error(res.__("act_does_not_exist"));
    }

    //Make sure all details were sent
    if (!req.body.name || !req.body.description || !req.body.reward_points)
      throw new Error(res.__("incomplete_request"));

    const name = sanitize(req.body.name);
    let description = req.body.description;
    let how_to_submit_evidences = req.body.how_to_submit_evidences;
    const reward_points = sanitize(req.body.reward_points);

    if (!name || !description || !reward_points)
      throw new Error(res.__("incomplete_request"));

    let act = await Act.findById(req.params.id);
    //Only the admin or act poster who uploaded this act can alter it
    if (!req.roles.administrator && req.user.id != act.act_provider.id)
      throw new Error(res.__("lack_auth"));

    if (!req.roles.administrator) act.enabled.state = false;
    act.name = name;
    // act.description = description;
    act.reward_points = reward_points;

    if (req.file) {
      //Process image
      const image = os.tmpdir() + "/" + req.file.filename;
      let error_drawing_file = false;
      let buffer;
      const file_name = uuidv4();
      await fs_read_file(image)
        .then(function(data) {
          buffer = data;
        })
        .then(async function() {
          await sharp(buffer)
            .resize(1600, 800)
            .toFile(`${process.env.files_folder}/${file_name}.png`);
        })
        .then(async function() {
          //If processing succeeds
          //Delete act former image if exists
          if (act.image)
            fs.unlinkSync(`${process.env.files_folder}/${act.image}`);
          //Attach this image to act
          act.image = `${file_name}.png`;
          //Add this image to file schema
          await FileSchema.create({
            uploader_id: mongoose.Types.ObjectId(req.user.id),
            proof_name: `${file_name}.png`,
            original_name: req.file.filename,
            size: req.file.size
          }).catch(function(error) {
            error_drawing_file = true;
          });
        });

      //If processing fails
      //Give error
      if (error_drawing_file) throw new Error("Invalid image");
    }

    //add extra fields
    //add description

    const re = /(?:\.([^.]+))?$/;
    let $ = cheerio.load(act.description);
    //Check if there are images in the description in the database
    if ($("img").length > 0) {
      //Compare with new description to figure out old images to delete
      const old_image_srcs = [];
      const new_image_srcs = [];
      const old_description_images = $("img");
      //Put database description image srcs in an array
      for (let i = 0; i < old_description_images.length; i++) {
        old_image_srcs.push(old_description_images[i].attribs["src"]);
      }
      //Check the new description for image srcs
      const new_description1 = cheerio.load(description);
      // console.log(new_description1("img").nextAll())
      if (new_description1("img").length > 0) {
        const new_description_images = new_description1("img");
        //For each new description src, check if it starts with '/'
        for (let i = 0; i < new_description_images.length; i++) {
          //If so, put in another array
          // console.log(new_description_images[i].prev.attribs["src"].charAt(0))
          if (new_description_images[i].attribs["src"].charAt(0) == "/")
            new_image_srcs.push(new_description_images[i].attribs["src"]);
        }
        //Check if old description src exists in new description src (Do it backwards)
        for (let i = old_image_srcs.length - 1; i >= 0; i--) {
          if (new_image_srcs.indexOf(old_image_srcs[i]) > -1) {
            //If so, remove from old array
            old_image_srcs.splice(i, 1);
          }
        }
      }
      //After everything is done,
      const promised_delete_files = [];
      for (let i = 0; i < old_image_srcs.length; i++) {
        //Get image link in old description src array
        old_image_srcs[i] = old_image_srcs[i].replace(`/api/acts/images/`, "");
        //Unlink all those images
        // console.log(`${process.env.files_folder}/${old_image_srcs[i]}`);
        promised_delete_files.push(
          fs_delete_file(`${process.env.files_folder}/${old_image_srcs[i]}`)
        );
        //Also delete from fileschema
        promised_delete_files.push(
          FileSchema.deleteOne({ proof_name: old_image_srcs[i] })
        );
      }
      await Promise.all(promised_delete_files);
    }

    //Add new images
    //Check if there are images in the new description
    //If image tag start with '/'
    //Skip
    //Else, decode, store, change src to link
    $ = cheerio.load(description);
    if ($("img").length > 0) {
      let ext;
      const image_promises = [];
      const image_names = [];
      const file_details = [];
      //Look for all images in the description
      const images = $("img");
      //Get unique names
      for (let i = 0; i < images.length; i++) {
        if (images[i].attribs["src"].charAt(0) != "/") {
          ext = re.exec(images[i].attribs["data-filename"])[1];
          if (ext == undefined) ext = "";
          else ext = `.${ext}`;
          image_names.push(uuidv4());
          //Convert them to files
          image_promises.push(
            base64Img.img(
              images[i].attribs.src,
              process.env.files_folder,
              image_names[i]
            )
          );
          image_names[i] = image_names[i] + ext;
          // .then(function(filepath) {});
        } else {
          image_names.push("");
          image_names[i] = images[i].attribs["src"];
        }
      }
      await Promise.all(image_promises);
      //Get their image links
      for (let i = 0; i < images.length; i++) {
        if (images[i].attribs["src"].charAt(0) != "/") {
          //Replace the src of the images in the description with the new links
          images[i].attribs["src"] = "/api/acts/images/" + image_names[i];
          file_details.push({
            uploader_id: mongoose.Types.ObjectId(req.user.id),
            proof_name: image_names[i],
            upload_time: new Date(),
            original_name: images[i].attribs["data-filename"],
            size: fs.statSync(`${process.env.files_folder}/${image_names[i]}`)
              .size
          });
        }
      }
      // console.log($.html())
      let new_description = $.html();
      new_description = new_description.split("<body>")[1];
      new_description = new_description.split("</body>")[0];
      description = new_description;
      //Insert these new files into the file schema
      if (file_details.length > 0)
        await FileSchema.collection.insertMany(file_details);
    }

    //Add other details
    act.description = description;
    // act.how_to_submit_evidences = how_to_submit_evidences;
    if (req.body.amount == "") req.body.amount = -1;
    act.amount = req.body.amount;
    act.expiration_date = req.body.expiration_date;
    act.importance = req.body.importance;

    if (!act.repeatable) {
      act.repeatable = req.body.repeatable;
    } else if (act.repeatable && req.body.repeatable == "false") throw new Error("A repeatable act cannot be made unrepeatable");

    //If this is an event
    if (act.__t == "Event") {
      //Make sure all fields were sent
      if (!req.body.start_time || !req.body.end_time)
        throw new Error(res.__("incomplete_request"));

      const start_time = sanitize(req.body.start_time);
      const end_time = sanitize(req.body.end_time);

      if (!start_time || !end_time)
        throw new Error(res.__("incomplete_request"));

      //Make sure start time is before end time
      if (moment(req.body.end_time).isBefore(req.body.start_time))
        throw new Error(res.__("start_before_end"));

      //Attach new values to it
      act.start_time = start_time;
      act.end_time = end_time;
    }

    await act.save();

    //Check if there is a tag
    //If there is,
    let my_tags = [];
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
        my_tags.push({
          name: element
        });
      });
      await Promise.all(promises);
    }
    act.tags = my_tags;
    await act.save();

    act = await Act.findById(act._id);

    logger.info(`${req.user.id} successfully edited act ${act._id}`);
    res.json(act);
    // res.json(await Act.findById(req.params.id));
  } catch (err) {
    next(createError(400, err.message));
    logger.error(`${req.user.id} failed to edit act ${req.params.id}`);
  }
});

//Change act state
router.put("/:id/state", async function(req, res, next) {
  try {
    if (!req.roles || !req.roles.act_poster) {
      throw new Error(res.__("lack_auth"));
    }

    const act = await Act.findById(req.params.id);

    //Only an admin or the act poster who uploaded this act can change its state
    if (!req.roles.administrator) {
      if (act.act_provider.id != req.user.id)
        throw new Error(res.__("lack_auth"));
    }

    //If act does not exist, error
    //If act is deleted, give error
    if (!act || act.deleted) throw new Error(res.__("act_does_not_exist"));

    let new_state;

    if (act.state == "AVAILABLE") new_state = "NOT_AVAILABLE";
    else new_state = "AVAILABLE";

    //Only the admin or act poster who uploaded this act can alter it
    if (!req.roles.administrator && req.user.id != act.act_provider.id)
      throw new Error(res.__("lack_auth"));

    act.state = new_state;
    await act.save();

    logger.info(
      `${req.user.id} successfully changed act ${act._id} availablity state`
    );
    res.json({ message: "Success" });
  } catch (err) {
    next(createError(400, err.message));
    logger.error(
      `${req.user.id} failed to change act ${req.params.id} availability state`
    );
  }
});

//Delete act
router.put("/:id/delete", async function(req, res, next) {
  try {
    if (!req.roles || !req.roles.act_poster) {
      throw new Error(res.__("lack_auth"));
    }

    const act = await Act.findById(req.params.id);

    //Only the admin or act poster who uploaded this act can delete it
    if (!req.roles.administrator && req.user.id != act.act_provider.id)
      throw new Error(res.__("lack_auth"));

    //Deleted acts can't be deleted again
    if (act.deleted) throw new Error(res.__("act_does_not_exist"));

    act.deleted = true;
    await act.save();

    logger.info(`${req.user.id} successfully deleted ${act._id}`);
    res.json({ message: "Success" });
  } catch (err) {
    next(createError(400, err.message));
    logger.error(`${req.user.id} failed to delete act ${req.params.id}`);
  }
});

//Delete act proof
router.delete("/proof/:id", async function(req, res, next) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    //Only admins and the person who uploaded the proof can delete it
    const user = await User.findOne({
      "acts.proof_of_completion._id": req.params.id
    });
    if (!req.user) throw new Error(res.__("lack_auth"));
    if (req.roles && !req.roles.administrator && user._id != req.user.id)
      throw new Error(res.__("lack_auth"));

    const act_proof = await User.aggregate([
      {
        $match: {
          "acts.proof_of_completion._id": mongoose.Types.ObjectId(req.params.id)
        }
      },
      { $unwind: "$acts" },
      {
        $match: {
          "acts.proof_of_completion._id": mongoose.Types.ObjectId(req.params.id)
        }
      },
      { $unwind: "$acts.proof_of_completion" },
      {
        $match: {
          "acts.proof_of_completion._id": mongoose.Types.ObjectId(req.params.id)
        }
      },
      {
        $project: {
          "acts.proof_of_completion.new_name": true,
          "acts.proof_of_completion.original_name": true
        }
      }
    ]);

    const new_name = act_proof[0].acts.proof_of_completion.new_name;
    const promises = [];

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
    const previous_image = `${process.env.files_folder}/${new_name}`;
    const promised_delete_file = fs_delete_file(previous_image);
    const promised_fileschema_delete = FileSchema.findOneAndDelete(
      {
        proof_name: new_name
      },
      { session }
    );

    promises.push(promised_delete_proof_from_act);
    promises.push(promised_delete_proof_from_user);
    promises.push(promised_delete_file);
    promises.push(promised_fileschema_delete);

    await Promise.all(promises);
    await session.commitTransaction();
    logger.info(`${req.user.id} successfully deleted proof ${req.params.id}`);
    //Return success
    res.json({ message: "Success" });
  } catch (err) {
    await session.abortTransaction();
    next(createError(400, err.message));
    logger.error(`${req.user.id} failed to delete proof ${req.params.id}`);
  } finally {
    session.endSession();
  }
});

//Delete act tag
router.delete("/:act_id/tag/:tag_id", async function(req, res, next) {
  try {
    if (!req.roles || !req.roles.act_poster)
      throw new Error(res.__("lack_auth"));

    //If this isn't the admin
    if (!req.roles.administrator) {
      //And it's a different act provider than the one who created the act
      //Give error
      const this_act = await Act.findOne({
        _id: req.params.act_id,
        "act_provider.id": req.user.id
      });
      if (!this_act) throw new Error(res.__("lack_auth"));

      if (this_act.deleted) throw new Error(res.__("act_does_not_exist"));
    }

    //Delete the tag from this act where _id is given
    await Act.findByIdAndUpdate(req.params.act_id, {
      $pull: { tags: { _id: req.params.tag_id } }
    });
    logger.info(
      `${req.user.id} successfully deleted act ${req.params.act_id} tag ${
        req.params.tag_id
      }`
    );
    res.json({ message: "Success" });
  } catch (err) {
    next(createError(400, err.message));
    logger.error(
      `${req.user.id} failed to delete act ${req.params.act_id} tag ${
        req.params.tag_id
      }`
    );
  }
});

module.exports = router;
