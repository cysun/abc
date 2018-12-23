const { Router } = require('express')
const User = require('../../models/User');
const globals = require('../../globals');
const Act = require('../../models/Act');
const Event_Act = require('../../models/Event');
var createError = require('http-errors');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = require('../../secret');
const fs = require('fs');
const sanitize = require("sanitize-html");
sanitize.defaults.allowedAttributes = [];
sanitize.defaults.allowedTags = [];
var upload = multer({
  dest: 'tmp/'
});

const router = Router()

//Show acts
router.get('/', async function (req, res, next) {
  try {
    if (!req.user) {
      throw new Error("You do not have authorization");
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
    if (req.query.search)
      search = { '$text': { '$search': sanitize(req.query.search) } };
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
    if (type != "MY_ACTS")
      search.enabled = enabled;

    // if (type == "undefined")
    //     type = req.cookies.type;

    if (!type || globals.user_act_types.indexOf(type) === -1)
      type = "AVAILABLE";

    //Deleted acts should not show up
    search['deleted'] = false;


    if (type == "AVAILABLE") {
      //Only return acts this user has not completed
      search['users_under_review.id'] = { '$not': { $eq: req.user.id } };
      search['completed_users.id'] = { '$not': { $eq: req.user.id } };
    }
    else if (type == 'UNDER_REVIEW')
      search['users_under_review.id'] = req.user.id;
    else if (type == 'COMPLETED')
      search['completed_users.id'] = req.user.id;
    else if (type == 'REJECTED')
      search['rejected_users.id'] = req.user.id;
    else if (type == 'MY_ACTS')
      search['act_provider.id'] = req.user.id;

    //Handle invalid page
    if (!page || page < 1)
      page = 1

    //Handle invalid act type
    if (!act_type || globals.act_types.indexOf(act_type) === -1)
      act_type = "AVAILABLE";

    //This ensures that when an act poster tries to get his acts
    //Available and unavailable acts are returned
    if (type != "MY_ACTS")
      search.state = act_type;

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



    //For some unknown reason, the below command gives this error: Projection cannot have a mix of inclusion and exclusion.
    // const promised_acts = Act.find(search, { users_who_clicked_on_this_act: false, users_who_completed_this_act: false }).sort({ [sort]: order }).skip(offset).limit(10).lean();
    const promised_acts = Act.find(search).sort({ [sort]: order }).skip(offset).limit(10).lean();
    const promised_count = Act.find(search).countDocuments();



    let promises = [promised_acts, promised_count];
    let acts;
    let count;
    let result = {};
    let counter;
    await Promise.all(promises)
      .then(function (values) {
        // result.result = values[0];
        // result.total_count = values[1][0]['count'];
        acts = values[0];
        count = values[1];
      })
    const act_count = count;
    count = Math.ceil(count / 10);
    const total = []
    for (let i = 0; i < count; i++)
      total.push(1);
    // acts.forEach(element => {
    //     if (!element.image)
    //         element.image = process.env.website + 'images/banner1.jpg';
    // });
    let current_page = process.env.website + 'acts?';

    if (!req.query.page)
      req.query.page = 1

    //Loop through the query parameters and append them to the url;
    if (req.query.search)
      current_page = current_page + 'search=' + req.query.search + '&';
    if (req.query.sort)
      current_page = current_page + 'sort=' + req.query.sort + '&';
    if (req.query.order)
      current_page = current_page + 'order=' + req.query.order + '&';

    // res.cookie('type', type, { maxAge: 3600000 })
    // if (!req.query.type)
    //     req.query.type = type

    res.json({
      acts,
      type,
      current_page,
      act_count,
      query: req.query,
      count, title: "Acts", acts, total_acts: total, user: req.user, roles: req.roles
    });

    // res.render('acts', { type, current_page, query: req.query, count, title: "Acts", acts, total_acts: total, user: req.user, roles: req.roles });
  }
  catch (err) {
    console.log(err)
    next(createError(400, err.message))
  }
})

//Create act
router.post('/:type', async function (req, res, next) {

  try {
    if (!req.roles || !req.roles.act_poster) {
      throw new Error("You do not have authorization");
    }
    // if (req.file)
    //     req.body.picture = './tmp/' + req.file.filename
    req.body.provider = req.user;
    let act;
    if (req.params.type == 'act')
      act = await Act.initialize(req.body);

    // //Handling events
    else if (req.params.type == 'event') {
      act = await Event_Act.initialize(req.body);
      act.start_time = req.body.start_time;
      act.end_time = req.body.end_time;
    }

    await act.save();
    // user = user.toObject();
    // delete user.password;
    // res.redirect('/acts?success=Success');
    res.json({ message: "Success" });
  } catch (err) {
    next(createError(400, err.message))
  }
})
// finally {
//   //Delete uploaded file
//   if (req.file)
//     fs.unlinkSync(req.body.profile_picture);
// }

//Edit act
router.put('/:id', async function (req, res, next) {
  try {
    if (!req.roles || !req.roles.act_poster) {
      throw new Error("You do not have authorization");
    }

    //Make sure all details were sent
    if (!req.body.name || !req.body.description || !req.body.reward_points)
      throw new Error("Incomplete request");

    const name = sanitize(req.body.name);
    const description = sanitize(req.body.description);
    const reward_points = sanitize(req.body.reward_points);

    if (!name || !description || !reward_points)
      throw new Error("Incomplete request");

    const act = await Act.findById(req.params.id);
    //Only the admin or act poster who uploaded this act can alter it
    if (!req.roles.administrator && req.user.id != act.act_provider.id)
      throw new Error("You do not have authorization");

    act.enabled.state = false;
    act.name = name;
    act.description = description;
    act.reward_points = reward_points;

    //If this is an event
    if (act.__t == 'Event') {
      //Make sure all fields were sent
      if (!req.body.start_time || !req.body.end_time)
        throw new Error("Incomplete request");

      const start_time = sanitize(req.body.start_time);
      const end_time = sanitize(req.body.end_time);

      if (!start_time || !end_time)
        throw new Error("Incomplete request");

        //Attach new values to it
        act.start_time = start_time;
        act.end_time = end_time
    }
    await act.save();

    res.json({ message: "Success" });
  } catch (err) {
    next(createError(400, err.message))
  }

})

//Change act state
router.put('/:id/state', async function (req, res, next) {
  try {
    if (!req.roles || !req.roles.act_poster) {
      throw new Error("You do not have authorization");
    }

    const act = await Act.findById(req.params.id);
    let new_state;

    if (act.state == "AVAILABLE")
      new_state = 'NOT_AVAILABLE';
    else
      new_state = 'AVAILABLE';

    //Only the admin or act poster who uploaded this act can alter it
    if (!req.roles.administrator && req.user.id != act.act_provider.id)
      throw new Error("You do not have authorization");

    act.state = new_state;
    await act.save();

    res.json({ message: "Success" });
  } catch (err) {
    next(createError(400, err.message))
  }

})

//Delete act
router.put('/:id/delete', async function (req, res, next) {
  try {
    if (!req.roles || !req.roles.act_poster) {
      throw new Error("You do not have authorization");
    }

    const act = await Act.findById(req.params.id);

    //Only the admin or act poster who uploaded this act can delete it
    if (!req.roles.administrator && req.user.id != act.act_provider.id)
      throw new Error("You do not have authorization");

    act.deleted = true;
    await act.save();

    res.json({ message: "Success" });
  } catch (err) {
    next(createError(400, err.message))
  }

})

module.exports = router
