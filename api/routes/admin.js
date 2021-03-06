const { Router } = require("express");
const User = require("../../models/User");
const Subscriber = require("../../models/Subscriber");
const globals = require("../../globals");
const Act = require("../../models/Act");
const Reward = require("../../models/Reward");
const Event_Act = require("../../models/Event");
var createError = require("http-errors");
const multer = require("multer");
const mongoose = require("mongoose");
const fs = require("fs");
const sanitize = require("sanitize-html");
const util = require("util");
const os = require("os");
const logger = require("../../logger").winston;
const mail = require("../../send_mail");
sanitize.defaults.allowedAttributes = [];
sanitize.defaults.allowedTags = [];
var upload = multer({
  dest: os.tmpdir()
});

const router = Router();

async function onlyAdminCanGetHere(req, res, next) {
  if (!req.roles || !req.roles.administrator) next(createError(400, res.__("lack_auth")));
  else next();
}

router.use(onlyAdminCanGetHere);

router.get("/acts", async function(req, res, next) {
  try {
    let type = Act;
    if (req.query.type == "event") type = Event_Act;
    //Only admin can get here
    if (!req.roles.administrator) throw new Error(res.__("lack_auth"));

    //Return acts with respect to search, sort, order
    let search = {};
    if (req.query.search)
      search = { $text: { $search: sanitize(req.query.search) } };

    let page = parseInt(sanitize(req.query.page));
    let sort = sanitize(req.query.sort);
    let order = parseInt(sanitize(req.query.order));

    //Handle invalid page
    if (!page || page < 1) page = 1;

    //Handle invalid act sort category
    if (!sort || globals.user_acts_sort_categories.indexOf(sort) === -1)
      sort = "name";

    //Handle invalid act order category
    if (!order || globals.user_acts_order_categories.indexOf(order) === -1)
      order = 1;

    let offset = (page - 1) * 10;

    let results;
    let count;
    results = type
      .find(search, {
        name: true,
        // description: true,
        enabled: true,
        creation_date: true,
        state: true,
        deleted: true,
        act_provider: true
      })
      .sort({ [sort]: order })
      .skip(offset)
      .limit(10)
      .lean();

    count = type.find(search).countDocuments();

    const promises = [results, count];
    let returned_results, pages;
    await Promise.all(promises).then(function(values) {
      returned_results = values[0];
      count = values[1];
      pages = Math.ceil(count / 10);
    });
    logger.info(`${req.user.id} successfully got acts`);
    res.json({ data: returned_results, count: pages });
  } catch (err) {
    console.log(err);
    next(createError(400, err.message));
    logger.error(`${req.user.id} failed to get acts`);
  }
});

router.get("/acts/:id/users/:page", async function(req, res, next) {
  try {
    //Return act details

    // //Only admin can get here
    if (!req.roles.administrator) throw new Error(res.__("lack_auth"));

    //Return acts with respect to search, sort, order
    let search;

    if (!req.query.search) search = "";
    else search = sanitize(req.query.search);

    // let page = parseInt(sanitize(req.query.page));

    let sort = sanitize(req.query.sort);
    let order = parseInt(sanitize(req.query.order));
    let type = sanitize(req.query.type);

    // //Handle invalid page
    // if (!page || page < 1) page = 1;

    //Handle invalid act sort category
    if (!sort || globals.user_acts_sort_categories.indexOf(sort) === -1)
      sort = "first_name";
    if (!type || globals.user_act_types.indexOf(type) === -1)
      type = "COMPLETED";
    if (!order || globals.user_acts_order_categories.indexOf(order) === -1)
      order = 1;

    if (type == "COMPLETED") {
      type = "$completed_users";
    } else if (type == "UNDER_REVIEW") {
      type = "$users_under_review";
    } else if (type == "REJECTED") {
      type = "$rejected_users";
    }

    const page = req.params.page;
    const skip = (page - 1) * 10;
    //Get act details (completed users)

    const type_last_name = type.substring(1) + ".last_name";
    const sort_type = type.substring(1) + "." + sort;

    const users = await Act.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(req.params.id) }
      },
      {
        $unwind: type
      },
      {
        $match: { [type_last_name]: new RegExp(".*" + search + ".*", "i") }
      },
      {
        $sort: { [sort_type]: order }
      },
      {
        $skip: skip
      },
      {
        $limit: 10
      },
      {
        $project: {
          completed_users: type,
          _id: false
        }
      }
    ]);

    // logger.info(`${req.user.id} successfully got acts`);
    res.json({ users });
  } catch (err) {
    console.log(err);
    next(createError(400, err.message));
    logger.error(`${req.user.id} failed to get acts`);
  }
});

router.get("/users/:id/acts/:page", async function(req, res, next) {
  try {
    // //Only admin can get here
    if (!req.roles.administrator) throw new Error(res.__("lack_auth"));

    //Return acts with respect to search, sort, order
    let search;
    // if (req.query.search)
    //   search = { $text: { $search: sanitize(req.query.search) } };

    if (!req.query.search) search = "";
    else search = sanitize(req.query.search);

    // let page = parseInt(sanitize(req.query.page));

    let sort = sanitize(req.query.sort);
    let order = parseInt(sanitize(req.query.order));
    let type = sanitize(req.query.type);

    // //Handle invalid page
    // if (!page || page < 1) page = 1;

    //Handle invalid act sort category
    if (!sort || globals.user_acts_sort_categories.indexOf(sort) === -1)
      sort = "name";
    if (!type || globals.user_act_types.indexOf(type) === -1)
      type = "COMPLETED";
    if (!order || globals.user_acts_order_categories.indexOf(order) === -1)
      order = 1;

    const page = req.params.page;
    const skip = (page - 1) * 10;
    //Get act details (completed users)

    const name = "populated_act.name";
    const type_last_name = type.substring(1) + ".last_name";
    let sort_type;
    if (sort == "name") sort_type = "populated_act.name";
    else if (sort == "time") sort_type = "acts.time";
    // const sort_type = type.substring(1) + "." + sort;

    const acts = await User.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(req.params.id) }
      },
      {
        $unwind: "$acts"
      },
      {
        $match: { "acts.state": type }
      },
      {
        $lookup: {
          from: "acts",
          localField: "acts.id",
          foreignField: "_id",
          as: "populated_act"
        }
      },
      {
        $match: { "populated_act.name": new RegExp(".*" + search + ".*", "i") }
      },
      {
        $sort: { [sort_type]: order }
      },
      {
        $skip: skip
      },
      {
        $limit: 10
      },
      {
        $project: {
          "populated_act.name": 1,
          "populated_act.act_provider.first_name": 1,
          "populated_act.act_provider.last_name": 1,
          _id: 0,
          "acts.time": 1
        }
      }
    ]);

    // logger.info(`${req.user.id} successfully got acts`);
    res.json({ acts });
  } catch (err) {
    console.log(err);
    next(createError(400, err.message));
    logger.error(`${req.user.id} failed to get acts`);
  }
});

router.get("/users/:id/points/:page", async function(req, res, next) {
  try {
    // //Only admin can get here
    if (!req.roles.administrator) throw new Error(res.__("lack_auth"));

    const page = req.params.page;
    const skip = (page - 1) * 10;

    const acts = await User.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(req.params.id) }
      },
      {
        $unwind: "$points_given_by_admin"
      },
      {
        $skip: skip
      },
      {
        $limit: 10
      },
      {
        $project: {
          points_given_by_admin: true,
          _id: false
        }
      }
    ]);

    // logger.info(`${req.user.id} successfully got acts`);
    res.json({ acts });
  } catch (err) {
    console.log(err);
    next(createError(400, err.message));
    logger.error(`${req.user.id} failed to get points`);
  }
});

router.post("/email", async function(req, res, next) {
  try {
    const name = req.body.name;
    const description = req.body.description;

    if (!name || !description) throw new Error("Incomplete Request");

    //Get all users who should get email
    //Get all verified emails
    //Get all unverified emails
    const promised_user_emails = User.find(
      {},
      { email: true, _id: false, unverified_email: true }
    ).lean();
    //Get all subcriber emails
    const promised_subscriber_emails = Subscriber.find(
      {},
      { email: true, _id: false }
    ).lean();

    const promises = [];
    promises.push(promised_user_emails);
    promises.push(promised_subscriber_emails);
    let user_emails, subscriber_emails;
    await Promise.all(promises).then(function(values) {
      user_emails = values[0];
      subscriber_emails = values[1];
    });
    //Merge
    const emails = [];
    for (let i = 0; i < user_emails.length; i++) {
      if (user_emails[i].email) emails.push(user_emails[i].email);
      if (user_emails[i].unverified_email)
        emails.push(user_emails[i].unverified_email);
    }
    for (let i = 0; i < subscriber_emails.length; i++) {
      if (emails.indexOf(subscriber_emails[i].email) == -1)
        emails.push(subscriber_emails[i].email);
    }
    // Send to all users
    await mail.sendEmail(emails, name, description);

    res.json({ Success: "Success" });
    logger.info(`Successfully sent emails`);
  } catch (err) {
    next(createError(400, err.message));
    logger.error(`Failed to send emails`);
  }
});

//Give/Remove user points
router.put("/users/:id/points", async function(req, res, next) {
  try {
    const points = req.body.points;
    const reason = req.body.reason;
    if (!points || !reason) throw new Error("Incomplete request");
    const data = {
      amount: points,
      reason: reason,
      given_by: {
        id: req.user.id,
        first_name: req.user.first_name,
        last_name: req.user.last_name
      }
    };
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { points: points },
      $push: { points_given_by_admin: data }
    });
    res.json({ Success: "Success" });
    logger.info(
      `${req.user.id} successfully gave user ${req.params.id} points`
    );
  } catch (err) {
    next(createError(400, err.message));
    logger.error(`${req.user.id} failed to give user ${req.params.id} points`);
  }
});

router.get("/rewards", async function(req, res, next) {
  try {
    //Only admin can get here
    if (!req.roles.administrator) throw new Error(res.__("lack_auth"));

    //Return acts with respect to search, sort, order
    let search = {};
    if (req.query.search)
      search = { $text: { $search: sanitize(req.query.search) } };

    let page = parseInt(sanitize(req.query.page));
    let sort = sanitize(req.query.sort);
    let order = parseInt(sanitize(req.query.order));

    //Handle invalid page
    if (!page || page < 1) page = 1;

    //Handle invalid act sort category
    if (!sort || globals.user_acts_sort_categories.indexOf(sort) === -1)
      sort = "name";

    //Handle invalid act order category
    if (!order || globals.user_acts_order_categories.indexOf(order) === -1)
      order = 1;

    let offset = (page - 1) * 10;

    let results;
    let count;
    results = Reward.find(search, {
      name: true,
      // description: true,
      enabled: true,
      creation_date: true,
      state: true,
      deleted: true,
      reward_provider: true
    })
      .sort({ [sort]: order })
      .skip(offset)
      .limit(10)
      .lean();

    count = Act.find(search).countDocuments();

    const promises = [results, count];
    let returned_results, pages;
    await Promise.all(promises).then(function(values) {
      returned_results = values[0];
      count = values[1];
      pages = Math.ceil(count / 10);
    });

    logger.info(`${req.user.id} successfully got rewards`);
    res.json({ data: returned_results, count: pages });
  } catch (err) {
    console.log(err);
    next(createError(400, err.message));
    logger.error(`${req.user.id} failed to get rewards`);
  }
});

//Show admin dashboard
router.get("/", async function(req, res, next) {
  var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };
  //Get the last 10 registered users
  let promised_users = User.find()
    .sort({ creation_date: -1 })
    .limit(10)
    .lean();
  let promised_acts = Act.find()
    .sort({ creation_date: -1 })
    .limit(10)
    .lean();
  let promised_rewards = Reward.find()
    .sort({ creation_date: -1 })
    .limit(10)
    .lean();

  //Get best act for this month
  //Get the highest completed act this month
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
    //Get only 1 acts
    { $limit: 1 }
  ]);

  //Get the count of completed users in between this period per act
  const promised_best_rewards_for_this_month = Reward.aggregate([
    {
      //Get acts that have been completed this month
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
        reward: {
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
    //Get only 1 rewards
    { $limit: 1 }
  ]);

  let total_users = User.find({}).countDocuments();
  let total_acts = Act.find({}).countDocuments();
  let total_rewards = Reward.find({}).countDocuments();

  const promises = [
    promised_users,
    promised_acts,
    promised_rewards,
    promised_best_acts_for_this_month,
    promised_best_rewards_for_this_month,
    total_users,
    total_acts,
    total_rewards
  ];

  let users, acts, rewards, best_act, best_reward;

  await Promise.all(promises).then(function(values) {
    users = values[0];
    acts = values[1];
    rewards = values[2];
    best_act = values[3];
    best_reward = values[4];

    total_users = values[5];
    total_acts = values[6];
    total_rewards = values[7];
  });

  users.forEach(element => {
    element.creation_date = element.creation_date.toLocaleDateString(
      "en-US",
      options
    );
  });
  acts.forEach(element => {
    element.creation_date = element.creation_date.toLocaleDateString(
      "en-US",
      options
    );
  });
  rewards.forEach(element => {
    if (element.creation_date)
      element.creation_date = element.creation_date.toLocaleDateString(
        "en-US",
        options
      );
  });
  res.json({
    users,
    acts,
    rewards,
    user: req.user,
    best_act,
    best_reward,
    total_users,
    total_acts,
    total_rewards
  });
});

module.exports = router;
