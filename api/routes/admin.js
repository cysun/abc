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

function uploadMultipleFiles(re, original_name, file_name, req) {
  let unique_name, ext;
  return Act.getUniqueProofImageName()
    .then(function (unique_image_name) {
      unique_name = unique_image_name;
      //Get extension for each file
      ext = re.exec(original_name)[1];
      //If no extension, use empty string
      if (ext == undefined)
        //If no extension, use empty string
        ext = "";
      else
        ext = `.${ext}`;
    })
    .then(function () {
      //Move the file to the acts proof folder with the new name and extension
      fs_rename_file(`./tmp/${file_name}`, `${process.env.act_picture_folder}${unique_name}${ext}`)
    })
    .then(function () {
      //Save the new file name and the uploaded file name
      if (!req.user.proof_of_completion)
        req.user.proof_of_completion = [];
      req.user.proof_of_completion.push({
        original_name: original_name,
        new_name: process.env.website + process.env.display_act_picture_folder + unique_name + ext
      });
    })
}

// //Handle proof
// router.put('/acts/:act_id/user/:user_id/approve', async function (req, res, next) {

//   //Only managers and admins can navigate to this endpoint
//   // if (!req.roles.manager) {
//   //     res.redirect('/');
//   //     res.end();
//   //     return;
//   // }

//   const rejected_user = req.body;
//   rejected_user.id = req.params.user_id;
//   rejected_user.state = "REJECTED";
//   const review_of_proof = {
//       //Note the person doing the rejection
//       reviewer_id: req.user.id,
//       reviewer_name: `${req.user.first_name} ${req.user.last_name}`,
//       time_of_review: Date.now(),
//       result: false,
//       //Note the rejection reason
//       comments: req.body.reason
//   }
//   rejected_user.review_of_proof = review_of_proof;

//   //If accepted
//   if (req.body.choice == 'approve') {
//       //Move the user to the completed array
//       //Increment completed counter
//       rejected_user.state = "COMPLETED";
//       rejected_user.review_of_proof.result = true;
//       await Act.findByIdAndUpdate(
//           req.params.act_id,
//           {
//               //Remove the user from the act under review array
//               $pull: { users_under_review: { id: req.params.user_id } },
//               $push: {
//                   //Add the user to the act logger as completed
//                   users_who_completed_this_act: rejected_user,
//                   //Add the user to the act completed array
//                   completed_users: rejected_user
//               },
//               $inc: {total_number_of_completions: 1}
//           }
//       )
//   }
//   //If rejected
//   else if (req.body.choice == 'reject') {
//       await Act.findByIdAndUpdate(
//           req.params.act_id,
//           {
//               //Remove the user from the act under review array
//               $pull: { users_under_review: { id: req.params.user_id } },
//               $push: {
//                   //Add the user to the act logger as rejected
//                   users_who_completed_this_act: rejected_user,
//                   //Add the user to the act rejected array
//                   rejected_users: rejected_user
//               }
//           }
//       )
//   }

//   //Redirect to calling page
//   res.redirect(req.headers.referer);

//   // //Get proof that are under review
//   // const acts = await Act.aggregate([
//   //     { $group: { _id: '$_id', users: { $push: '$users_under_review' }, act: { $push: '$name' }, reward: { $push: '$reward_points' } } }
//   // ])
//   // res.render('manage_proof', { title: "Manage Proofs", acts });
// });

//Approve user act proof
router.put('/:act_id/user/:user_id/approve', async function (req, res, next) {
  try {
    let promises = [];
    // const user = await User.findById(req.params.user_id)
    const promised_user = User.findOne(
      { _id: req.params.user_id, 'acts.id': req.params.act_id },
      { 'acts.$': true, first_name: true, last_name: true, email: true }
    ).lean();
    const promised_act = Act.findById(req.params.act_id);

    let user, act;
    promises = [promised_user, promised_act];
    await Promise.all(promises)
      .then(function (values) {
        user = values[0];
        act = values[1];
      })

    const user_who_completed_this_act = Object.assign({}, user);
    user_who_completed_this_act.id = user_who_completed_this_act._id;
    delete user_who_completed_this_act._id;
    user_who_completed_this_act.state = "COMPLETED";
    user_who_completed_this_act.proof_of_completion = user_who_completed_this_act.acts[0].proof_of_completion;
    //Add this manager as the reviewer of this proof
    user_who_completed_this_act.review_of_proof = {
      reviewer_id: req.user.id,
      reviewer_name: `${req.user.first_name} ${req.user.last_name}`,
      //Note the time of the review
      time_of_review: Date.now(),
      result: true
    }

    // console.log(user_who_completed_this_act);
    // res.end();

    // const user_who_completed_this_act = {
    //   id: user._id,
    //   first_name: user.first_name,
    //   last_name: user.last_name,
    //   state: "COMPLETED",
    //   proof_of_completion
    // }




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
      })


    const promised_user_change = User.findOneAndUpdate(
      { _id: req.params.user_id, 'acts.id': req.params.act_id },
      {
        //Change the state of this act to completed in the user object
        "acts.$.state": "COMPLETED",
        "acts.$.time": Date.now(),
        //Add the points of this act to the user points
        $inc: { points: act.reward_points }
      }
    )

    promises = [promised_act_change, promised_user_change];
    await Promise.all(promises);

    //Send approved proof mail
    await mail.sendMail(user.email, "Your proof has been approved", `Click <a href='${process.env.website}acts/${req.params.act_id}'>here</a> to view the approved act`);

    res.json({ message: "Success" });

  } catch (err) {
    console.log(err);
    next(createError(400, err.message))
  }
});

//Disapprove user act proof
router.put('/:act_id/user/:user_id/disapprove', async function (req, res, next) {
  try {
    let promises = [];
    // const user = await User.findById(req.params.user_id)
    const promised_user = User.findOne(
      { _id: req.params.user_id, 'acts.id': req.params.act_id },
      { 'acts.$': true, first_name: true, last_name: true, email: true }
    ).lean();
    const promised_act = Act.findById(req.params.act_id);

    let user, act;
    promises = [promised_user, promised_act];
    await Promise.all(promises)
      .then(function (values) {
        user = values[0];
        act = values[1];
      })

    const user_who_completed_this_act = Object.assign({}, user);
    user_who_completed_this_act.id = user_who_completed_this_act._id;
    delete user_who_completed_this_act._id;
    user_who_completed_this_act.state = "REJECTED";
    user_who_completed_this_act.proof_of_completion = user_who_completed_this_act.acts[0].proof_of_completion;
    //Add this manager as the reviewer of this proof
    user_who_completed_this_act.review_of_proof = {
      reviewer_id: req.user.id,
      reviewer_name: `${req.user.first_name} ${req.user.last_name}`,
      //Note the time of the review
      time_of_review: Date.now(),
      result: false,
      comments: req.body.comments
    }

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
      })


    const promised_user_change = User.findOneAndUpdate(
      { _id: req.params.user_id, 'acts.id': req.params.act_id },
      {
        //Change the state of this act to rejected in the user object
        "acts.$.comments": req.body.comments,
        "acts.$.state": "REJECTED",
        "acts.$.time": Date.now()
      }
    )

    promises = [promised_act_change, promised_user_change];
    await Promise.all(promises);

    //Send approved proof mail
    await mail.sendMail(user.email, "Your proof has been rejected", `<p>Reason: ${req.body.comments}</p><p>Click <a href='${process.env.website}acts/${req.params.act_id}'>here</a> to change your proof</p>`);

    res.json({ message: "Success" });

  } catch (err) {
    console.log(err);
    next(createError(400, err.message))
  }
});

//Show acts that are in review
router.get('/review', async function (req, res, next) {
  try {
    let page = parseInt(sanitize(req.query.page));
    //Handle invalid page
    if (!page || page < 1)
      page = 1

    let offset = (page - 1) * 10;
    const promised_acts = Act.find({ "users_under_review": { $exists: true, $ne: [] } }).skip(offset).limit(10).lean();
    const promised_count = Act.find({ "users_under_review": { $exists: true, $ne: [] } }).countDocuments();

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
    let current_page = process.env.website + 'manage/proofs?';

    if (!req.query.page)
      req.query.page = 1

    //Loop through the query parameters and append them to the url;

    // console.log(req.roles);

    res.json({
      acts,
      current_page,
      act_count,
      query: req.query,
      count, title: "Acts", total_acts: total, user: req.user, roles: req.roles
    });

    // res.json({acts, roles: req.roles});
  } catch (err) {
    console.log(err);
    next(createError(400, err.message))
  }
});


//Upload proof of completion
router.post('/:id/complete', upload.array('files'), async function (req, res, next) {
  // const image = './tmp/' + req.file.filename
  try {

    var re = /(?:\.([^.]+))?$/;

    //Make sure at least one file was uploaded
    if (req.files.length == 0)
      //If not, give error
      throw new Error("No files were uploaded");

    //Get unique names for each file upload
    let promises = [];
    for (let i = 0; i < req.files.length; i++)
      promises.push(uploadMultipleFiles(re, req.files[i].originalname, req.files[i].filename, req));

    await Promise.all(promises);

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
      { $match: { 'users_who_completed_this_act.id': mongoose.Types.ObjectId(req.user.id) } },
      { $sort: { 'users_who_completed_this_act.time_completed': -1 } },
      { $limit: 1 },
      { $project: { users_who_completed_this_act: 1 } }
    ])
      .then(async function (act) {
        //Check if it's under review
        if (!act[0] || act[0].users_who_completed_this_act.state != "UNDER_REVIEW") {
          //If not
          //Create a new user act
          await Act.findByIdAndUpdate(
            req.params.id,
            {
              $push: { 'users_who_completed_this_act': user },
              $addToSet: { 'users_under_review': user },
              // Remove this user from the users who were rejected
              $pull: { rejected_users: { id: req.user.id } }
            }
          )
        }
        //If it's under review
        else {
          //Add these proofs to the act (users who completed and under review users)
          // await Act.findOneAndUpdate(
          //   {'users_who_completed_this_act._id': act[0].users_who_completed_this_act._id },
          //   {
          //     $push: {
          //       'users_who_completed_this_act.$.proof_of_completion': user.proof_of_completion,
          //       'users_under_review.proof_of_completion': user.proof_of_completion
          //     }
          //   }
          // )
          await Act.findOneAndUpdate(
            { 'users_who_completed_this_act.id': act[0].users_who_completed_this_act.id },
            {
              $push: {
                'users_who_completed_this_act.$.proof_of_completion': user.proof_of_completion,
              }
            }
          )
          await Act.findOneAndUpdate(
            { 'users_under_review.id': act[0].users_who_completed_this_act.id },
            {
              $push: {
                'users_under_review.$.proof_of_completion': user.proof_of_completion,
              },
              //Remove this user from the users who were rejected
              // $pull: { rejected_users: { id: mongoose.Types.ObjectId(req.user.id) } }
            }
          )
        }

        // throw new Error("not real error")

      })
    // .catch(function (err) {

    // })











    //else
    //Create a new Object in users who completed this act and under review users
    // const promised_act_change = await User.findOne(
    //   { _id: req.user.id, acts: { $elemMatch: { id: req.params.id, state: "UNDER_REVIEW" } } }
    // )
    //   .then(function (user) {
    //     if (!user)
    //       return null;
    //     //If last state of this user_act is 'under review'
    //     //Add these proofs to the users who completed this act object
    //     //Add these proofs to the under review acts object
    //     await Act.findOneAndUpdate(
    //       {_id: req.params.id, 'users_who_completed_this_act'},
    //       { $push: { 'acts.$.proof_of_completion': user.proof_of_completion } }
    //     )


    //   })

    // res.end();
    // return;

    // const promised_act_change = Act.findByIdAndUpdate(
    //   req.params.id,
    //   {
    //     $push: { 'users_who_completed_this_act': user },
    //     $addToSet: { 'users_under_review': user }
    //     // $inc: { 'total_number_of_completions': 1 }
    //   }
    // )


    // //Upsert
    // const promised_user_change = User.findOneAndUpdate(
    //   { '_id': user.id, 'acts.id': req.params.id },
    //   { $set: { 'acts.$': act } },
    //   async function (err, numberAffected, rawResponse) {
    //     if (!numberAffected) {
    //       await User.findByIdAndUpdate(
    //         user.id,
    //         { $push: { 'acts': act } }
    //       )
    //     }
    //   }

    // )


    const act = {
      id: req.params.id,
      state: "UNDER_REVIEW",
      time: Date.now(),
      proof_of_completion: user.proof_of_completion
    }

    //Upsert
    //Change act to under review
    //Update time as well
    //Add the new files that were uploaded as well
    const promised_user_change = User.findOneAndUpdate(
      { '_id': user.id, 'acts.id': req.params.id },
      {
        $set: { 'acts.$.state': "UNDER_REVIEW", 'acts.$.time': Date.now() },
        $addToSet: { 'acts.$.proof_of_completion': user.proof_of_completion }
      },
      async function (err, numberAffected, rawResponse) {
        if (!numberAffected) {
          //If not exists, insert act
          await User.findByIdAndUpdate(
            user.id,
            { $push: { 'acts': act } }
          )
        }
      }

    )






    promises.push(promised_act_change, promised_user_change);
    await Promise.all(promises);

    // //Redirect to calling page with success message
    // res.redirect(url.parse(req.headers.referer).pathname + '?Success=' + 'Success');

    //Return only the new uploads
    res.json(req.user.proof_of_completion)
  } catch (err) {
    next(createError(400, err.message))
  }
  // finally {
  //   //Delete uploaded file
  //   if (req.file)
  //     fs.unlinkSync(image);
  // }
})


//Get events
router.get('/calendar', async function (req, res, next) {
  //Get all events in the range
  const events = await Event_Act.find({
    start_time: { $gte: req.query.start },
    end_time: { $lte: req.query.end }
  }, { name: 1, start_time: 1, end_time: 1 }).lean();

  events.forEach(element => {
    element.title = element.name;
    element.start = element.start_time;
    element.end = element.end_time;
    element.url = `acts/${element._id}`;
  });

  res.json(events);
});

// //Get individual act
// router.get('/:id', async function (req, res, next) {
//   // console.log(req.headers.referer);
//   // try {
//   //     let error_occured = false;
//   //     let user = await User.findOne({});
//   //     user.deleteProfilePicture();
//   //     await user.save()
//   //     res.send("Finished");
//   // } catch (error) {
//   //     res.send(error);
//   // }

//   //Get act
//   const promised_act = Act.aggregate([
//     {
//       //Get specific act
//       $match: { _id: mongoose.Types.ObjectId(req.params.id) }
//     },
//     {
//       $unwind: {
//         //Split document based on users who have completed the act
//         path: '$users_who_completed_this_act',
//         //But return at least one document if no one has completed this act
//         preserveNullAndEmptyArrays: true
//       }
//     },
//     {
//       $match: {
//         $or: [
//           //Get the documents where this user has completed the act
//           { 'users_who_completed_this_act': req.user.id },
//           //But return all documents if this user hasn't completed the act
//           {}
//         ]
//       }
//     },
//     {
//       $sort: { 'users_who_completed_this_act.time_completed': -1 }
//     },
//     { $limit: 1 },
//     { $project: { users_who_clicked_on_this_act: false } }
//   ])
//   //Add this user to the act click counter
//   const promised_click_counter = Act.findByIdAndUpdate(
//     req.params.id,
//     {
//       $push: { 'users_who_clicked_on_this_act': req.user },
//       $inc: { 'total_number_of_clicks': 1 }
//     }
//   )

//   let result;
//   await Promise.all([promised_act, promised_click_counter])
//     .then(function (values) {
//       result = values[0][0];
//     })
//   // .catch(function (error) {
//   //     console.log(error);
//   // })
//   //Return act with this user as the completed user or no user at all
//   // let upload_text = res.__('change_upload_text');
//   if (result.users_who_completed_this_act && result.users_who_completed_this_act.id.valueOf() != req.user.id) {
//     // upload_text = res.__('upload_text');
//     delete result.users_who_completed_this_act;
//   }


//   res.json({
//     act: result,
//     user: req.user
//   });
//   // res.render('act', { title: result.name, act: result, user: req.user, roles: req.roles, upload_text });

// });

//Get individual act
router.get('/:id', async function (req, res, next) {
  //Get act from Act table
  //Get user's relationship with act from user table
  //Combine and deliver

  const promised_act = Act.findById(req.params.id, "act_provider start_time end_time description enabled name reward_points state total_number_of_clicks total_number_of_completions").lean();
  const promised_user = User.findOne(
    { _id: req.user.id, 'acts.id': req.params.id },
    { 'acts.$': 1 }
  )
  //Add this user to the act click counter
  const promised_click_counter = Act.findByIdAndUpdate(
    req.params.id,
    {
      $push: { 'users_who_clicked_on_this_act': req.user },
      $inc: { 'total_number_of_clicks': 1 }
    }
  )
  const promises = [promised_act, promised_user, promised_click_counter];
  let act, user_act;
  await Promise.all(promises)
    .then(function (values) {
      act = values[0];
      user_act = values[1];
    })
  res.json({ act, user: req.user, proofs: user_act });
});

router.put('/:id/enable/:state', async function (req, res, next) {
  //Only managers and admins can get here
  //Change the state of the act accordingly
  try {
    await Act.findByIdAndUpdate(
      req.params.id,
      { 'enabled.state': req.params.state }
    )
    res.json({ message: "Success" });
  } catch (err) {
    next(createError(400, err.message))
  }
});

//Show admin dashboard
router.get('/', async function (req, res, next) {
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  //Get the last 10 registered users
  let promised_users = User.find().sort({ creation_date: -1 }).limit(10).lean();
  let promised_acts = Act.find().sort({ creation_date: -1 }).limit(10).lean();
  let promised_rewards = Reward.find().sort({ creation_date: -1 }).limit(10).lean();

  const promises = [promised_users, promised_acts, promised_rewards];

  let users, acts, rewards;

  await Promise.all(promises)
    .then(function (values) {
      users = values[0];
      acts = values[1];
      rewards = values[2];
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
  res.json({ users, acts, rewards, user: req.user })
  // res.render('admin', { layout: 'admin_layout', title: "Admin dashboard", user: req.user, error: req.query.error, users: users });
});

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

//Delete act proof
router.delete('/proof/:new_name', async function (req, res, next) {
  const new_name = atob(req.params.new_name);
  try {
    //Only admins and the person who uploaded the proof can delete it
    const user = await User.findOne(
      { "acts.proof_of_completion.new_name": new_name },
    )
    if (!req.user)
      throw new Error("You do not have authorization");
    if (!req.roles.administrator && user._id != req.user.id)
      throw new Error("You do not have authorization");

    // await User.findOneAndUpdate(
    //   { "acts.proof_of_completion.new_name": new_name },
    //   { $pull: { "acts.$.proof_of_completion": { new_name: new_name } } }
    // )
    // res.json({message: "Success"});

    const promises = [];
    //Delete the proof from the act object
    //Remove from users who have completed this act
    //Remove from users under review and rejected users
    const promised_delete_proof_from_act = Act.findOneAndUpdate(
      { "users_who_completed_this_act.proof_of_completion.new_name": new_name },
      {
        $pull: {
          "users_who_completed_this_act.$.proof_of_completion": { new_name: new_name },
          "rejected_users.$.proof_of_completion": { new_name: new_name },
          "users_under_review.$.proof_of_completion": { new_name: new_name }
        }
      }
    )
    //Delete the proof from the user object
    const promised_delete_proof_from_user = User.findOneAndUpdate(
      { "acts.proof_of_completion.new_name": new_name },
      { $pull: { "acts.$.proof_of_completion": { new_name: new_name } } }
    )
    //Delete the proof file
    const previous_image = process.env.act_picture_folder + new_name.replace(process.env.website + process.env.display_act_picture_folder, '');
    const promised_delete_file = fs_delete_file(previous_image);

    promises.push(promised_delete_proof_from_act);
    promises.push(promised_delete_proof_from_user);
    promises.push(promised_delete_file);

    await Promise.all(promises);
    //Return success
    res.json({ message: "Success" });
  } catch (err) {
    next(createError(400, err.message))
  }

})

module.exports = router