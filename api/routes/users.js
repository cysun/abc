const { Router } = require('express')
const User = require('../../models/User');
var createError = require('http-errors');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = require('../../secret');
const globals = require('../../globals');
const fs = require('fs');
const mail = require('../../send_mail');
const sanitize = require("sanitize-html");
sanitize.defaults.allowedAttributes = [];
sanitize.defaults.allowedTags = [];
var upload = multer({
  dest: 'tmp/'
});

const router = Router()

// Mock Users
const users = [
  { name: 'Alexandre' },
  { name: 'Pooya' },
  { name: 'Sébastien' }
]

/* GET users listing. */
router.get('/', async function (req, res, next) {
  try {
    //Only admin can get here
    if (!req.roles.administrator)
      throw new Error("You do not have authorization");

    //Return users with respect to search, sort, order and
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
      sort = "first_name";

    //Handle invalid act order category
    if (!order || globals.user_acts_order_categories.indexOf(order) === -1)
      order = 1;

    let offset = (page - 1) * 10;

    let results;
    let count;
    results = User.find(
      search,
      {
        first_name: true,
        last_name: true,
        enabled: true,
        creation_date: true
      }
    ).sort({ [sort]: order }).skip(offset).limit(10).lean();

    count = User.find(search).countDocuments();

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

/* GET user by ID. */
router.get('/users/:id', function (req, res, next) {
  const id = parseInt(req.params.id)
  if (id >= 0 && id < users.length) {
    res.json(users[id])
  } else {
    res.sendStatus(404)
  }
})



//Edit user
router.get('/:id/edit', async function (req, res, next) {
  try {
    // let users = await User.findById(req.params.id);
    // users.forEach(element => {
    //     element.creation_date = element.creation_date.toLocaleDateString("en-US", options);
    // });
    const user = await User.findById(req.params.id);
    const roles = {};
    if (user) {
      //Check roles
      if (user.roles.length > 0) {
        user.roles.forEach(element => {
          //Attach roles in array into distinct properties
          switch (element.name) {
            case "Act Poster":
              roles.act_poster = true;
              break;
            case "Reward Provider":
              roles.reward_provider = true;
              break;
            case "Manager":
              roles.manager = true;
              break;
            case "Administrator":
              roles.reward_provider = true;
              roles.administrator = true;
              roles.act_poster = true;
              roles.manager = true;
              break;
          }
        });
      }
    }
    res.json({ user, roles })
    // res.render('admin_edit', { layout: 'admin_layout', roles: roles, title: "Admin dashboard", user: req.user, error: req.query.error, this_user: user });
  } catch (err) {
    next(createError(400, err.message))
  }
});

//Edit user
router.put('/:id', async function (req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.roles = req.body.roles;
    user.enabled = req.body.enabled;
    await user.save();
    res.json({ message: "Success" });
  } catch (err) {
    next(createError(400, err.message))
  }
});

module.exports = router
