const { Router } = require("express");
const User = require("../../models/User");
const globals = require("../../globals");
const Act = require("../../models/Act");
const Reward = require("../../models/Reward");
const Event_Act = require("../../models/Event");
var createError = require("http-errors");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = require("../../secret");
const FileSchema = require("../../models/File");
const mongoose = require("mongoose");
const util = require("util");
const fs = require("fs");
const fs_read_file = util.promisify(fs.readFile);
const sanitize = require("sanitize-html");
const cheerio = require("cheerio");
const base64Img = require("base64-img-promise");
const fs_delete_file = util.promisify(fs.unlink);
const atob = require("atob");
const fs_rename_file = util.promisify(fs.rename);
const mail = require("../../send_mail");
const logger = require("../../logger").winston;
const sharp = require("sharp");
const uuidv4 = require("uuid/v4");
const os = require('os');
sanitize.defaults.allowedAttributes = [];
sanitize.defaults.allowedTags = [];
var upload = multer({
  dest: os.tmpdir(),
  limits: { fieldSize: 25 * 1024 * 1024 * 1024 }
});

const router = Router();

//Get individual Reward
router.get("/:id", async function(req, res, next) {
  //Get Reward from Reward table
  //Get user's relationship with Reward from user table
  //Combine and deliver

  const promised_act = Reward.findById(
    req.params.id,
    "reward_provider description image enabled name value amount state total_number_of_users_who_clicked_on_this_reward total_number_of_users_who_got_this_reward"
  ).lean();
  //Get user points as well
  const promised_user = User.findOne(
    { _id: req.user.id, "rewards.id": req.params.id },
    { "rewards.$": 1}
  );
  const promised_user_points = User.findById(req.user.id, {_id: false, points: true});
  //Add this user to the reward click counter
  const promised_click_counter = Reward.findByIdAndUpdate(req.params.id, {
    $push: { users_who_clicked_on_this_reward: req.user },
    $inc: { total_number_of_users_who_clicked_on_this_reward: 1 }
  });
  //Get this user's rating for this reward and reward provider
  const promised_rating = Reward.findOne(
    {
      _id: req.params.id,
      "reviews.id": req.user.id
    },
    { "reviews.$": true, _id: false }
  );
  const promises = [
    promised_act,
    promised_user,
    promised_click_counter,
    promised_rating,
    promised_user_points
  ];
  let act, user_act, review, points;
  await Promise.all(promises).then(function(values) {
    act = values[0];
    user_act = values[1];
    review = values[3];
    points = values[4];
  });
  logger.info(`${req.user.id} successfully got rewards`);
  res.json({
    act,
    user: req.user,
    rewards: user_act,
    review,
    roles: req.roles,
    points
  });
});

//Request Reward
router.put("/:reward_id/user/:user_id/request_reward", async function(
  req,
  res,
  next
) {
  //Check if the user has enough points to get this reward
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const promised_user = User.findById(req.params.user_id).lean();
    const promised_reward = Reward.findById(req.params.reward_id).lean();
    const promises = [promised_user, promised_reward];
    let user, reward;
    await Promise.all(promises).then(function(values) {
      user = values[0];
      reward = values[1];
    });

    //If not, return error
    if (user.points < reward.value)
      throw new Error(res.__("not_enough_points"));

    //Else

    user.id = user._id;
    delete user._id;
    const promised_rewards_change = Reward.findByIdAndUpdate(
      req.params.reward_id,
      {
        //Place the user object in the reward object
        $push: { users_who_claimed_this_reward: user }
      },
      { session }
    );

    reward.id = reward._id;
    reward.state = "ON_GOING";
    delete reward._id;

    //Place the reward object in the User object
    const promised_user_change = User.findByIdAndUpdate(
      req.params.user_id,
      {
        $push: { rewards: reward },
        //Deduct the points from the user
        $inc: { points: `-${reward.value}` }
      },
      { session }
    );

    await Promise.all([promised_rewards_change, promised_user_change]);

    await session.commitTransaction();
    logger.info(
      `${req.user.id} successfully requested reward ${req.params.reward_id}`
    );
    //Return success message
    res.json({ message: "Success" });
  } catch (err) {
    await session.abortTransaction();
    next(createError(400, err.message));
    logger.error(
      `${req.user.id} failed to request reward ${req.params.reward_id}`
    );
  } finally {
    session.endSession();
  }
});

router.put("/:reward_id/review", async function(req, res, next) {
  try {
    //Add this user to the review array for this reward
    const user = req.user;
    user.reward_rating = req.body.reward_rating;
    user.reward_comments = req.body.reward_comments;
    user.reward_provider_rating = req.body.reward_provider_rating;
    user.reward_provider_comments = req.body.reward_provider_comments;

    const reward = await Reward.findByIdAndUpdate(
      req.params.reward_id,
      { $push: { reviews: user } },
      { new: true }
    );
    //Send email to review provider about new review
    // await mail.sendMail(reward.reward_provider.email, "There is a new review of your reward", `Your reward has a new review`);
    await mail.sendNewReviewNotice(reward.reward_provider.email, req.params.reward_id);

    logger.info(
      `${req.user.id} successfully reviewed reward ${req.params.reward_id}`
    );
    //Return success message
    res.json({ message: "Success" });
  } catch (err) {
    next(createError(400, err.message));
    logger.error(
      `${req.user.id} failed to review reward ${req.params.reward_id}`
    );
  }
});

router.put("/:reward_id/user/:user_id/collected", async function(
  req,
  res,
  next
) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const promised_user = User.findById(req.params.user_id).lean();
    const promised_reward = Reward.findById(req.params.reward_id).lean();
    const promises = [promised_user, promised_reward];
    let user, reward;
    await Promise.all(promises).then(function(values) {
      user = values[0];
      reward = values[1];
    });

    const reward_changes = {};

    //If amount is equal to 0, give error
    if (reward.amount == 0) throw new Error(res.__("reward_is_not_available"));
    //If amount is 1, make unavailable
    else if (reward.amount == 1) {
      reward_changes.state = "NOT_AVAILABLE";
    }

    reward_changes["$inc"] = {
      //Increment collected users
      total_number_of_users_who_got_this_reward: 1,
      //Reduce amount available
      amount: -1
    };

    //Alter reward object to add this user to collected users
    user.id = user._id;
    user.state = "COMPLETED";
    delete user._id;
    reward_changes["$push"] = { users_who_claimed_this_reward: user };

    

    const promised_rewards_change = Reward.findByIdAndUpdate(
      req.params.reward_id,
      reward_changes,
      { session }
    );

    //Add the value to the reward provider points
    const promised_reward_provider_change = User.findByIdAndUpdate(
      reward.reward_provider.id,
      { $inc: { points: reward.value } },
      { session }
    );

    //Alter user object to make this reward collected. Note current time
    const promised_user_change = User.findOneAndUpdate(
      { _id: req.params.user_id, "rewards.id": req.params.reward_id },
      { "rewards.$.state": "COMPLETED", "rewards.$.time": Date.now() },
      { session }
    );

    //Email reward provider and reward collector that the transaction is done.
    // const promised_user_mail = mail.sendMail(user.email, "Reward transaction is completed", `Click <a href='${process.env.website}rewards/${reward._id}'>here</a> to rate the reward`);
    const promised_user_mail = mail.sendRewardTransactionCompleteNotice(
      user.email,
      reward._id
    );
    // const promised_reward_provider_mail = mail.sendMail(reward.reward_provider.email, "Your reward has been collected", `Click <a href='${process.env.website}rewards/${reward._id}'>here</a> to see the reward`);
    const promised_reward_provider_mail = mail.sendRewardcollectedNoticeToRewardProvider(
      reward.reward_provider.email,
      reward._id
    );

    await Promise.all([
      promised_user_mail,
      promised_reward_provider_mail,
      promised_rewards_change,
      promised_user_change,
      promised_reward_provider_change
    ]);
    await session.commitTransaction();
    logger.info(
      `${req.user.id} successfully collected reward ${req.params.reward_id}`
    );
    //Return success message
    res.json({ message: "Success" });
  } catch (err) {
    await session.abortTransaction();
    next(createError(400, err.message));
    logger.error(
      `${req.user.id} failed to collect reward ${req.params.reward_id}`
    );
  } finally {
    session.endSession();
  }
});

router.put("/:id/enable/:state", async function(req, res, next) {
  //Only managers and admins can get here
  //Change the state of the Reward accordingly
  try {
    await Reward.findByIdAndUpdate(req.params.id, {
      enabled: req.params.state
    });
    logger.info(
      `${req.user.id} successfully changed reward ${req.params.id} state`
    );
    res.json({ message: "Success" });
  } catch (err) {
    next(createError(400, err.message));
    logger.error(
      `${req.user.id} failed to change reward ${req.params.id} state`
    );
  }
});

//Show rewards
router.get("/", async function(req, res, next) {
  try {
    if (!req.user) {
      throw new Error(res.__("lack_auth"));
    }
    //   try {
    //     let user = await User.findOne({});
    //     await user.sendVerificationEmail();
    //     await user.save();
    //     res.send("Finished");
    //   } catch (error) {
    //     res.send(error);
    //   }

    //Get list of act IDs this user has completed

    //Get 10 latest available acts WRT user search query
    let search = {};
    let search_text = { $match: {} };
    if (req.query.search) {
      search = { $text: { $search: sanitize(req.query.search) } };
      search_text = {
        $match: { $text: { $search: sanitize(req.query.search) } }
      };
    }
    // search = { 'users_under_review.id': { '$not': { $eq: req.user.id } } };

    //Act must be enabled
    const enabled = true;

    let page = parseInt(sanitize(req.query.page));
    let act_type = sanitize(req.query.act_type);
    let sort = sanitize(req.query.sort);
    let type = sanitize(req.query.type);
    let order = parseInt(sanitize(req.query.order));
    const this_object = this;

    //This ensures that when an act poster tries to get his acts
    //Enabled and disabled acts are returned
    if (type != "MY_REWARDS") search.enabled = enabled;

    // if (type == "undefined")
    //     type = req.cookies.type;

    //If this is a manager, the default view should be All acts
    // if (req.roles && req.roles.manager)
    //   if (!type || globals.user_act_types.indexOf(type) === -1)
    //     type = "ALL";

    if (type == "ALL") delete search.enabled;
    else if (type == "ENABLED") search.enabled = true;
    else if (type == "DISABLED") search.enabled = false;

    if (!type || globals.user_act_types.indexOf(type) === -1)
      type = "AVAILABLE";

    //Deleted acts should not show up
    search["deleted"] = false;

    if (type == "AVAILABLE") {
      //Only return acts this user has not completed
      // search['users_under_review.id'] = { '$not': { $eq: req.user.id } };
      // search['completed_users.id'] = { '$not': { $eq: req.user.id } };
      search["users_who_claimed_this_reward"] = {
        $not: {
          $elemMatch: { id: req.user.id, state: "COMPLETED", state: "ON_GOING" }
        }
      };
    } else if (type == "REQUESTED") {
      delete search.enabled;
      delete search.deleted;
      search["users_who_claimed_this_reward"] = {
        //Get acts where this user is in an on going state
        $elemMatch: {
          id: req.user.id,
          state: "ON_GOING"
        },
        //but this user is not in a completed state as well
        $not: {
          $elemMatch: {
            id: req.user.id,
            state: "COMPLETED"
          }
        }
      };
      // search['users_who_claimed_this_reward.id'] = req.user.id;
    } else if (type == "COLLECTED") {
      delete search.enabled;
      delete search.deleted;
      search["users_who_claimed_this_reward"] = {
        $elemMatch: {
          id: req.user.id,
          state: "COMPLETED"
        }
      };
      // search['users_who_claimed_this_reward.id'] = req.user.id;
      // search['users_who_claimed_this_reward.state'] = "COMPLETED";
    } else if (type == "CLOSED") {
      //Get rewards that have at least one user who has collected it
      search["users_who_claimed_this_reward.state"] = "COMPLETED";
      search["reward_provider.id"] = req.user.id;
    } else if (type == "MY_REWARDS") {
      //Return all my non deleted rewards even if disabled or unavailable
      delete search.enabled;
      // delete search.deleted;
      search["reward_provider.id"] = req.user.id;
    } else if (type == "MY_ACTS") search["act_provider.id"] = req.user.id;

    //Handle invalid page
    if (!page || page < 1) page = 1;

    //Handle invalid act type
    if (!act_type || globals.act_types.indexOf(act_type) === -1)
      act_type = "AVAILABLE";

    //This ensures that when an act poster tries to get his acts
    //Available and unavailable acts are returned
    if (type != "MY_REWARDS") search.state = act_type;

    if (type == "COMPLETED" || type == "REQUESTED") delete search.state;

    //Handle invalid act sort category
    if (!sort || globals.user_acts_sort_categories.indexOf(sort) === -1)
      sort = "name";

    //Handle invalid act order category
    if (!order || globals.user_acts_order_categories.indexOf(order) === -1)
      order = 1;

    let offset = (page - 1) * 10;

    //Get the requested acts of this user (10)
    // let promises = [results, count];
    // let result = {};
    // let counter;
    // await Promise.all(promises)
    //     .then(function (values) {
    //         result.result = values[0];
    //         result.total_count = values[1][0]['count'];
    //     })
    // return result;

    // console.log(search);

    //For some unknown reason, the below command gives this error: Projection cannot have a mix of inclusion and exclusion.
    // const promised_acts = Act.find(search, { users_who_clicked_on_this_act: false, users_who_completed_this_act: false }).sort({ [sort]: order }).skip(offset).limit(10).lean();
    const promised_acts = Reward.find(search)
      .sort({ [sort]: order })
      .skip(offset)
      .limit(10)
      .lean();
    const promised_count = Reward.find(search).countDocuments();
    const promised_user_reward_points = User.findById(req.user.id, {
      points: true,
      _id: false
    });

    let promised_open_acts = null;
    let promised_open_acts_count = null;
    if (type == "OPEN") {
      //Get rewards that have a higher count of on going claims than completions
      promised_open_acts = Reward.aggregate([
        search_text,
        {
          $match: {
            "reward_provider.id": mongoose.Types.ObjectId(req.user.id),
            users_who_claimed_this_reward: { $exists: true, $ne: [] }
          }
        },
        { $unwind: "$users_who_claimed_this_reward" },
        { $match: { "users_who_claimed_this_reward.state": "ON_GOING" } },
        {
          $group: {
            _id: "$_id",
            reward: { $addToSet: "$$ROOT" },
            number_of_users_who_requested_this_reward: {
              $sum: 1
            }
          }
        },
        {
          $project: {
            reward: { $arrayElemAt: ["$reward", 0] },
            number_of_users_who_requested_this_reward: true
          }
        },
        {
          $addFields: {
            total_number_of_users_who_got_this_reward:
              "$reward.total_number_of_users_who_got_this_reward"
          }
        },
        {
          $project: {
            cmp: {
              $cmp: [
                "$number_of_users_who_requested_this_reward",
                "$total_number_of_users_who_got_this_reward"
              ]
            },
            reward: true,
            _id: false
          }
        },
        { $match: { cmp: 1 } },
        { $sort: { [sort]: order } },
        { $skip: offset },
        { $limit: 10 },
        {
          $project: {
            "reward.users_who_clicked_on_this_reward": false,
            "reward.users_who_claimed_this_reward": false,
            cmp: false
          }
        }
      ]);

      promised_open_acts_count = Reward.aggregate([
        search_text,
        {
          $match: {
            users_who_claimed_this_reward: { $exists: true, $ne: [] }
          }
        },
        { $unwind: "$users_who_claimed_this_reward" },
        { $match: { "users_who_claimed_this_reward.state": "ON_GOING" } },
        {
          $group: {
            _id: "$_id",
            reward: { $addToSet: "$$ROOT" },
            number_of_users_who_requested_this_reward: {
              $sum: 1
            }
          }
        },
        {
          $project: {
            reward: { $arrayElemAt: ["$reward", 0] },
            number_of_users_who_requested_this_reward: true
          }
        },
        {
          $addFields: {
            total_number_of_users_who_got_this_reward:
              "$reward.total_number_of_users_who_got_this_reward"
          }
        },
        {
          $project: {
            cmp: {
              $cmp: [
                "$number_of_users_who_requested_this_reward",
                "$total_number_of_users_who_got_this_reward"
              ]
            },
            reward: true,
            _id: false
          }
        },
        { $match: { cmp: 1 } },
        { $count: "count" }
      ]);
    }

    //Get best rewards of the month
    //Get the 3 highest collected rewards this month
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

    //Get the count of collected users in between this period per act
    const promised_best_acts_for_this_month = Reward.aggregate([
      {
        //Get rewards that have been collected this month
        $match: {
          users_who_claimed_this_reward: {
            $elemMatch: {
              state: "COMPLETED",
              time: { $gte: lower_date, $lt: upper_date }
            }
          }
        }
      },
      //Split based on the users who completed the acts
      { $unwind: "$users_who_claimed_this_reward" },
      //Get only the users who completed each act in the specified period
      {
        $match: {
          "users_who_claimed_this_reward.state": "COMPLETED",
          "users_who_claimed_this_reward.time": {
            $gte: lower_date,
            $lt: upper_date
          }
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

    let promises = [promised_acts, promised_count, promised_user_reward_points];
    if (type == "OPEN")
      promises.push(promised_open_acts, promised_open_acts_count);
    promises.push(promised_best_acts_for_this_month);
    let acts;
    let count = 0;
    let reward_points;
    let best_acts;
    let result = {};
    let counter;
    await Promise.all(promises).then(function(values) {
      // result.result = values[0];
      // result.total_count = values[1][0]['count'];
      acts = values[0];
      // console.log(acts)
      count = values[1];
      reward_points = values[2];
      if (type == "OPEN") {
        acts = [];
        values[3].forEach(element => {
          acts.push(element.reward);
        });
        if (values[4] && values[4][0]) count = values[4][0].count;
        // acts = values[3];

        // acts.forEach(element => {
        //   if ()
        // });
        // console.log(acts);
      }
      best_acts = values[values.length - 1];
    });
    const act_count = count;
    count = Math.ceil(count / 10);
    const total = [];
    for (let i = 0; i < count; i++) total.push(1);
    // acts.forEach(element => {
    //     if (!element.image)
    //         element.image = process.env.website + 'images/banner1.jpg';
    // });
    let current_page = process.env.website + "rewards?";

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

    logger.info(`${req.user.id} successfully got rewards`);

    res.json({
      reward_points,
      acts,
      best_acts,
      type,
      current_page,
      act_count,
      query: req.query,
      count,
      title: "Rewards",
      acts,
      total_acts: total,
      user: req.user,
      roles: req.roles
    });

    // res.render('acts', { type, current_page, query: req.query, count, title: "Acts", acts, total_acts: total, user: req.user, roles: req.roles });
  } catch (err) {
    next(createError(400, err.message));
    logger.info(`${req.user.id} failed to get rewards`);
  }
});

//Show users relationships with rewards
router.get("/:id/details", async function(req, res, next) {
  try {
    let search = {};
    if (req.query.search)
      search = { $text: { $search: sanitize(req.query.search) } };

    let page = parseInt(sanitize(req.query.page));
    let act_type = sanitize(req.query.act_type);
    let sort = sanitize(req.query.sort);
    let order = parseInt(sanitize(req.query.order));
    let type = sanitize(req.query.type);

    //If type is not sent,
    //Make type open transactions
    if (!type || globals.reward_types.indexOf(type) === -1) type = "OPEN";

    //Handle invalid page
    if (!page || page < 1) page = 1;

    //Handle invalid act sort category
    if (!sort || globals.user_acts_sort_categories.indexOf(sort) === -1)
      sort = "first_name";

    if (sort == "creation_date") sort = "rewards.time";

    //Handle invalid act order category
    if (!order || globals.user_acts_order_categories.indexOf(order) === -1)
      order = 1;

    let offset = (page - 1) * 10;

    let condition;
    //Open
    if (type == "OPEN") condition = "ON_GOING";
    //Closed
    else if (type == "CLOSED") condition = "COMPLETED";
    //Reviews

    let results;
    let count;
    if (type == "OPEN" || type == "CLOSED") {
      results = User.find(
        {
          $and: [
            {
              rewards: {
                $elemMatch: {
                  id: req.params.id,
                  state: condition
                }
              }
            },
            search
          ]
        },
        {
          first_name: true,
          last_name: true,
          email: true,
          "rewards.$": true
        }
      )
        .sort({ [sort]: order })
        .skip(offset)
        .limit(10)
        .lean();

      count = User.find(
        {
          $and: [
            {
              rewards: {
                $elemMatch: {
                  id: req.params.id,
                  state: condition
                }
              }
            },
            search
          ]
        },
        {
          first_name: true,
          last_name: true,
          "rewards.$": true
        }
      ).countDocuments();
    }

    if (type == "REVIEWS") {
      results = Reward.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
        { $unwind: "$reviews" },
        { $project: { reviews: true } },
        { $sort: { "reviews.time": -1 } },
        { $skip: offset },
        { $limit: 10 },
        {
          $group: {
            _id: null,
            reviews: { $push: "$reviews" }
            // count: {
            //   $sum: 1
            // }
          }
        },
        { $project: { _id: false } }
      ]);

      count = Reward.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
        { $unwind: "$reviews" },
        { $project: { reviews: true } },
        { $sort: { "reviews.time": -1 } },
        { $count: "count" }
      ]);
    }

    //Return the amount of points this reward has accumulated
    let points = User.aggregate([
      //Gets Acts this user has completed
      {
        $match: {
          "rewards.id": mongoose.Types.ObjectId(req.params.id)
        }
      },
      //Creates an array of many documents with a single (different) act in each one
      { $unwind: "$rewards" },
      // //Gets the documents with the specified act.name
      { $match: { "rewards.id": mongoose.Types.ObjectId(req.params.id) } },
      { $match: { "rewards.state": "COMPLETED" } },
      {
        $group: {
          _id: null,
          sum: {
            $sum: "$rewards.value"
          }
        }
      },
      { $project: { sum: 1, _id: 0 } }
    ]);

    let reward = Reward.findById(req.params.id, {
      users_who_clicked_on_this_reward: false,
      users_who_claimed_this_reward: false
    });

    const promises = [results, count, points, reward];
    // let results, count, points
    let returned_results, pages, sum;
    await Promise.all(promises).then(function(values) {
      reward = values[3];

      if (type != "REVIEWS") {
        returned_results = values[0];
        count = values[1];
        pages = Math.ceil(count / 10);
        sum = 0;
        if (values[2][0]) sum = values[2][0].sum;
      } else {
        if (values[0][0])
        returned_results = values[0][0].reviews;
        else returned_results = [];
        if (values[1][0])
        count = values[1][0].count;
        else count = 0;
        pages = Math.ceil(count / 10);
        sum = 0;
        if (values[2][0]) sum = values[2][0].sum;
      }
    });
    logger.info(
      `${req.user.id} successfully got reward ${req.params.id} relationships`
    );
    res.json({
      data: returned_results,
      count: pages,
      sum,
      reward,
      roles: req.roles
    });
  } catch (err) {
    next(createError(400, err.message));
    logger.error(
      `${req.user.id} failed to get reward ${req.params.id} relationships`
    );
  }
});

//Create Reward
router.post("/", upload.single("file"), async function(req, res, next) {
  try {
    if (!req.roles || !req.roles.reward_provider) {
      throw new Error(res.__("lack_auth"));
    }

    const user = await User.findById(req.user.id).lean();

    user.id = user._id;
    delete user._id;

    const reward = new Reward({
      name: req.body.name,
      description: req.body.description,
      value: req.body.value,
      amount: req.body.amount,
      reward_provider: user
    });

    let error_drawing_file = false;
    if (req.file) {
      let buffer;
      const file_name = uuidv4();
      const picture = os.tmpdir() + "\\" + req.file.filename;
      await fs_read_file(picture)
        .then(function(data) {
          buffer = data;
        })
        .then(async function() {
          await sharp(buffer)
            .resize(1600, 800)
            .toFile(`${process.env.files_folder}/${file_name}.png`);
        })
        .catch(function(error) {
          error_drawing_file = true;
        })
        .then(function() {
          //Attach profile picture to user
          reward.image = `${file_name}.png`;
        });
    }

    if (error_drawing_file) throw new Error("Invalid image");

    if (req.file) {
      const file_object = {
        uploader_id: mongoose.Types.ObjectId(req.user.id),
        proof_name: reward.image,
        original_name: req.file.originalname,
        size: req.file.size
      };

      // console.log(file_object);

      await FileSchema.create(file_object);
    }

    if (req.roles.administrator) reward.enabled = true;

    //Process description
    //Check if there are images in the description
    const re = /(?:\.([^.]+))?$/;
    const $ = cheerio.load(req.body.description);
    if ($("img").length > 0) {
      let ext;
      const image_promises = [];
      const image_names = [];
      const file_details = [];
      //Look for all images in the description
      const images = $("img");
      //Get unique names
      for (let i = 0; i < images.length; i++) {
        if (!images[i].attribs["src"]) continue;
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
      }
      await Promise.all(image_promises);
      //Get their image links
      for (let i = 0; i < images.length; i++) {
        if (!images[i].attribs["src"]) continue;
        //Replace the src of the images in the description with the new links
        $("img")[i].attribs["src"] =
          "/api/rewards/images/" + image_names[i];
        file_details.push({
          uploader_id: mongoose.Types.ObjectId(req.user.id),
          proof_name: image_names[i],
          upload_time: new Date(),
          original_name: images[i].attribs["data-filename"],
          size: fs.statSync(`${process.env.files_folder}/${image_names[i]}`)
            .size
        });
        console.log($("img")[i].attribs["src"]);
      }
      let new_description = $.html();
      new_description = new_description.split("<body>")[1];
      new_description = new_description.split("</body>")[0];
      // description = new_description;
      reward.description = new_description;
      //Insert these new files into the file schema
      if (file_details.length > 0)
        await FileSchema.collection.insertMany(file_details);
    }

    await reward.save();

    // if (req.file)
    //     req.body.picture = './tmp/' + req.file.filename
    // req.body.provider = req.user;
    // let act;
    // if (req.params.type == 'act')
    //   act = await Act.initialize(req.body);

    // // //Handling events
    // else if (req.params.type == 'event') {
    //   act = await Event_Act.initialize(req.body);
    //   act.start_time = req.body.start_time;
    //   act.end_time = req.body.end_time;
    // }

    // await act.save();
    // user = user.toObject();
    // delete user.password;
    // res.redirect('/acts?success=Success');
    logger.info(`${req.user.id} successfully created reward`);
    res.json({ message: "Success" });
  } catch (err) {
    next(createError(400, err.message));
    logger.error(`${req.user.id} failed to create reward`);
  } finally {
    if (req.file) fs.unlinkSync(os.tmpdir() + "\\" + req.file.filename);
  }
});
// finally {
//   //Delete uploaded file
//   if (req.file)
//     fs.unlinkSync(req.body.profile_picture);
// }

//Get act image
router.get("/:id/image", async function(req, res, next) {
  try {
    const act_image = await Reward.findById(req.params.id, {
      _id: false,
      image: true
    });
    res.sendFile(`${process.env.files_folder}/${act_image.image}`);
  } catch (err) {
    next(createError(400, err.message));
    logger.error("Failed to get reward image");
  }
});

//Get act image
router.get("/images/:id", async function(req, res, next) {
  try {
    res.sendFile(`${process.env.files_folder}/${req.params.id}`);
  } catch (err) {
    next(createError(400, err.message));
    logger.error("Failed to get act image");
  }
});

router.delete("/:id/image", async function(req, res, next) {
  try {
    const promises = [];
    const act = await Reward.findById(req.params.id, { image: true, _id: false });
    //Delete image from file system
    promises.push(fs_delete_file(`${process.env.files_folder}/${act.image}`));
    //Delete image from act and file tables
    promises.push(
      Reward.findByIdAndUpdate(req.params.id, { $unset: { image: "" } })
    );
    promises.push(FileSchema.findOneAndDelete({ proof_name: act.image }));
    await Promise.all(promises);
    //Return success message
    res.json({ message: "Success" });
  } catch (err) {
    next(createError(400, err.message));
    logger.error(`${req.user.id} failed to delete reward ${req.params.id} image`);
  }
});

//Edit reward
router.put("/:id", upload.single("file"), async function(req, res, next) {
  try {
    if (!req.roles || !req.roles.reward_provider) {
      throw new Error(res.__("lack_auth"));
    }

    //Make sure all details were sent
    if (
      !req.body.name ||
      !req.body.description ||
      !req.body.value ||
      !req.body.amount
    )
      throw new Error(res.__("incomplete_request"));

    const name = sanitize(req.body.name);
    const description = req.body.description;
    const value = sanitize(req.body.value);
    const amount = sanitize(req.body.amount);

    if (!name || !description || !value || !amount)
      throw new Error(res.__("incomplete_request"));

    const act = await Reward.findById(req.params.id);
    //Only the admin or act poster who uploaded this act can alter it
    if (!req.roles.administrator && req.user.id != act.reward_provider.id)
      throw new Error(res.__("lack_auth"));

    act.enabled = false;
    act.name = name;
    act.value = value;
    act.amount = amount;

    //If this is an event
    // if (act.__t == 'Event') {
    //   //Make sure all fields were sent
    //   if (!req.body.start_time || !req.body.end_time)
    //     throw new Error("Incomplete request");

    //   const start_time = sanitize(req.body.start_time);
    //   const end_time = sanitize(req.body.end_time);

    //   if (!start_time || !end_time)
    //     throw new Error("Incomplete request");

    //   //Attach new values to it
    //   act.start_time = start_time;
    //   act.end_time = end_time
    // }

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
      // console.log(old_image_srcs);
      // console.log(new_image_srcs);
      //After everything is done,
      const promised_delete_files = [];
      for (let i = 0; i < old_image_srcs.length; i++) {
        //Get image link in old description src array
        old_image_srcs[i] = old_image_srcs[i].replace(`/api/rewards/images/`, "");
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

    act.description = description;

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
          images[i].attribs["src"] =
            "/api/rewards/images/" + image_names[i];
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
      // description = new_description;
      //Insert these new files into the file schema
      if (file_details.length > 0)
        await FileSchema.collection.insertMany(file_details);

      console.log(new_description);
      act.description = new_description
    }

    if (req.file) {
      //Process image
      const image = os.tmpdir() + "\\" + req.file.filename;
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

    if (req.roles.administrator) act.enabled = true;
    await act.save();

    logger.info(`${req.user.id} successfully edited reward ${req.params.id}`);
    res.json({ message: "Success" });
  } catch (err) {
    next(createError(400, err.message));
    logger.error(`${req.user.id} failed to edit reward ${req.params.id}`);
  }
});

//Change Reward state
router.put("/:id/state", async function(req, res, next) {
  try {
    if (!req.roles || !req.roles.manager) {
      throw new Error(res.__("lack_auth"));
    }

    const act = await Reward.findById(req.params.id);
    let new_state;

    if (act.enabled == true) new_state = false;
    else new_state = true;

    //Only managers
    if (!req.roles.manager) throw new Error(res.__("lack_auth"));

    act.enabled = new_state;
    await act.save();

    logger.info(
      `${req.user.id} successfully changed reward ${req.params.id} state`
    );
    res.json({ message: "Success" });
  } catch (err) {
    next(createError(400, err.message));
    logger.info(
      `${req.user.id} failed to change reward ${req.params.id} state`
    );
  }
});

//Change Reward state
router.put("/:id/user_state", async function(req, res, next) {
  try {
    if (!req.roles || !req.roles.reward_provider) {
      throw new Error(res.__("lack_auth"));
    }

    const act = await Reward.findById(req.params.id);
    let new_state;

    if (act.state == "AVAILABLE") new_state = "NOT_AVAILABLE";
    else new_state = "AVAILABLE";

    //Only the admin or act poster who uploaded this act can alter it
    if (!req.roles.administrator && req.user.id != act.reward_provider.id)
      throw new Error(res.__("lack_auth"));

    act.state = new_state;
    await act.save();

    logger.info(
      `${req.user.id} successfully changed reward ${req.params.id} state`
    );
    res.json({ message: "Success" });
  } catch (err) {
    next(createError(400, err.message));
    logger.error(
      `${req.user.id} failed to change reward ${req.params.id} state`
    );
  }
});

//Delete Reward
router.put("/:id/delete", async function(req, res, next) {
  try {
    if (!req.roles || !req.roles.reward_provider) {
      throw new Error(res.__("lack_auth"));
    }

    const act = await Reward.findById(req.params.id);

    //Only the admin or act poster who uploaded this act can delete it
    if (!req.roles.administrator && req.user.id != act.reward_provider.id)
      throw new Error(res.__("lack_auth"));

    act.deleted = true;
    await act.save();

    logger.info(`${req.user.id} successfully deleted reward ${req.params.id}`);
    res.json({ message: "Success" });
  } catch (err) {
    next(createError(400, err.message));
    logger.error(`${req.user.id} failed to delete reward ${req.params.id}`);
  }
});

module.exports = router;
