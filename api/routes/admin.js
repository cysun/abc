const { Router } = require('express')
const User = require('../../models/User');
const globals = require('../../globals');
const Act = require('../../models/Act');
const Reward = require('../../models/Reward');
const Event_Act = require('../../models/Event');
var createError = require('http-errors');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = require('../../secret');
const mongoose = require('mongoose');
const fs = require('fs');
const sanitize = require("sanitize-html");
const util = require('util');
const fs_delete_file = util.promisify(fs.unlink);
const atob = require('atob');
const fs_rename_file = util.promisify(fs.rename);
const mail = require('../../mail');
sanitize.defaults.allowedAttributes = [];
sanitize.defaults.allowedTags = [];
var upload = multer({
  dest: 'tmp/'
});

const router = Router()

router.get('/acts', async function (req, res, next) {
  try {
    //Only admin can get here
    if (!req.roles.administrator)
      throw new Error("You do not have authorization");

    //Return acts with respect to search, sort, order
    let search = {};
    if (req.query.search)
      search = { '$text': { '$search': sanitize(req.query.search) } };

    let page = parseInt(sanitize(req.query.page));
    let sort = sanitize(req.query.sort);
    let order = parseInt(sanitize(req.query.order));

    //Handle invalid page
    if (!page || page < 1)
      page = 1

    //Handle invalid act sort category
    if (!sort || globals.user_acts_sort_categories.indexOf(sort) === -1)
      sort = "name";

    //Handle invalid act order category
    if (!order || globals.user_acts_order_categories.indexOf(order) === -1)
      order = 1;

    let offset = (page - 1) * 10;

    let results;
    let count;
    results = Act.find(
      search,
      {
        name: true,
        // description: true,
        enabled: true,
        creation_date: true,
        state: true,
        deleted: true,
        act_provider: true
      }
    ).sort({ [sort]: order }).skip(offset).limit(10).lean();

    count = Act.find(search).countDocuments();

    const promises = [results, count]
    let returned_results, pages
    await Promise.all(promises)
      .then(function (values) {
        returned_results = values[0];
        count = values[1];
        pages = Math.ceil(count / 10);
      })
    res.json({ data: returned_results, count: pages })
  }
  catch (err) {
    console.log(err)
    next(createError(400, err.message))
  }
})

router.get('/rewards', async function (req, res, next) {
  try {
    //Only admin can get here
    if (!req.roles.administrator)
      throw new Error("You do not have authorization");

    //Return acts with respect to search, sort, order
    let search = {};
    if (req.query.search)
      search = { '$text': { '$search': sanitize(req.query.search) } };

    let page = parseInt(sanitize(req.query.page));
    let sort = sanitize(req.query.sort);
    let order = parseInt(sanitize(req.query.order));

    //Handle invalid page
    if (!page || page < 1)
      page = 1

    //Handle invalid act sort category
    if (!sort || globals.user_acts_sort_categories.indexOf(sort) === -1)
      sort = "name";

    //Handle invalid act order category
    if (!order || globals.user_acts_order_categories.indexOf(order) === -1)
      order = 1;

    let offset = (page - 1) * 10;

    let results;
    let count;
    results = Reward.find(
      search,
      {
        name: true,
        // description: true,
        enabled: true,
        creation_date: true,
        state: true,
        deleted: true,
        reward_provider: true
      }
    ).sort({ [sort]: order }).skip(offset).limit(10).lean();

    count = Act.find(search).countDocuments();

    const promises = [results, count]
    let returned_results, pages
    await Promise.all(promises)
      .then(function (values) {
        returned_results = values[0];
        count = values[1];
        pages = Math.ceil(count / 10);
      })
    res.json({ data: returned_results, count: pages })
  }
  catch (err) {
    console.log(err)
    next(createError(400, err.message))
  }
})

//Show admin dashboard
router.get('/', async function (req, res, next) {
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  //Get the last 10 registered users
  let promised_users = User.find().sort({ creation_date: -1 }).limit(10).lean();
  let promised_acts = Act.find().sort({ creation_date: -1 }).limit(10).lean();
  let promised_rewards = Reward.find().sort({ creation_date: -1 }).limit(10).lean();

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
        'completed_users.time': { $gte: lower_date },
        'completed_users.time': { $lt: upper_date }
      }
    },
    //Split based on the users who completed the acts
    { $unwind: "$completed_users" },
    //Get only the users who completed each act in the specified period
    {
      $match: {
        'completed_users.time': { $gte: lower_date },
        'completed_users.time': { $lt: upper_date }
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
  ])

  //Get the count of completed users in between this period per act
  const promised_best_rewards_for_this_month = Reward.aggregate([
    {
      //Get acts that have been completed this month
      $match: {
        users_who_claimed_this_reward:
        {
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
        'users_who_claimed_this_reward.state': "COMPLETED",
        'users_who_claimed_this_reward.time': { $gte: lower_date, $lt: upper_date }
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
  ])

  let total_users = User.find({}).countDocuments();
  let total_acts = Act.find({}).countDocuments();
  let total_rewards = Reward.find({}).countDocuments();

  const promises = [promised_users, promised_acts, promised_rewards, promised_best_acts_for_this_month, promised_best_rewards_for_this_month, total_users, total_acts, total_rewards];

  let users, acts, rewards, best_act, best_reward;

  await Promise.all(promises)
    .then(function (values) {
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
    element.creation_date = element.creation_date.toLocaleDateString("en-US", options);
  });
  acts.forEach(element => {
    element.creation_date = element.creation_date.toLocaleDateString("en-US", options);
  });
  rewards.forEach(element => {
    if (element.creation_date)
      element.creation_date = element.creation_date.toLocaleDateString("en-US", options);
  });
  res.json({ users, acts, rewards, user: req.user, best_act, best_reward, total_users, total_acts, total_rewards })
  // res.render('admin', { layout: 'admin_layout', title: "Admin dashboard", user: req.user, error: req.query.error, users: users });
});

module.exports = router
