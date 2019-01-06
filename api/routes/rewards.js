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
const mail = require('../../send_mail');
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

  const promised_act = Reward.findById(req.params.id, "reward_provider description enabled name value amount state total_number_of_users_who_clicked_on_this_reward total_number_of_users_who_got_this_reward").lean();
  const promised_user = User.findOne(
    { _id: req.user.id, 'rewards.id': req.params.id },
    { 'rewards.$': 1 }
  )
  //Add this user to the reward click counter
  const promised_click_counter = Reward.findByIdAndUpdate(
    req.params.id,
    {
      $push: { 'users_who_clicked_on_this_reward': req.user },
      $inc: { 'total_number_of_users_who_clicked_on_this_reward': 1 }
    }
  )
  //Get this user's rating for this reward and reward provider
  const promised_rating = Reward.findOne(
    {
      _id: req.params.id,
      'reviews.id': req.user.id
    },
    { 'reviews.$': true, _id: false }
  )
  const promises = [promised_act, promised_user, promised_click_counter, promised_rating];
  let act, user_act, review;
  await Promise.all(promises)
    .then(function (values) {
      act = values[0];
      user_act = values[1];
      review = values[3];
      // console.log(user_act)
    })
  res.json({ act, user: req.user, rewards: user_act, review });
});

router.put('/:reward_id/user/:user_id/request_reward', async function (req, res, next) {
  //Check if the user has enough points to get this reward
  try {
    const promised_user = User.findById(req.params.user_id).lean();
    const promised_reward = Reward.findById(req.params.reward_id).lean();
    const promises = [promised_user, promised_reward];
    let user, reward;
    await Promise.all(promises)
      .then(function (values) {
        user = values[0];
        reward = values[1];
      });

    //If not, return error
    if (user.points < reward.value)
      throw new Error("You do not have enough points to claim this reward");

    //Else
    user.id = user._id;
    delete user._id;
    const promised_rewards_change = Reward.findByIdAndUpdate(
      req.params.reward_id,
      {
        //Place the user object in the reward object
        $push: { users_who_claimed_this_reward: user }
      }
    )

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
      }
    )

    await Promise.all([promised_rewards_change, promised_user_change]);


    //Return success message
    res.json({ message: "Success" });
  } catch (err) {
    next(createError(400, err.message))
  }
});

router.put('/:reward_id/review', async function (req, res, next) {

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
    )
    //Send email to review provider about new review
    // await mail.sendMail(reward.reward_provider.email, "There is a new review of your reward", `Your reward has a new review`);
    await mail.sendNewReviewNotice(reward.reward_provider.email);

    //Return success message
    res.json({ message: "Success" });
  } catch (err) {
    next(createError(400, err.message))
  }
});

router.put('/:reward_id/user/:user_id/collected', async function (req, res, next) {









  try {
    const promised_user = User.findById(req.params.user_id).lean();
    const promised_reward = Reward.findById(req.params.reward_id).lean();
    const promises = [promised_user, promised_reward];
    let user, reward;
    await Promise.all(promises)
      .then(function (values) {
        user = values[0];
        reward = values[1];
      });

    const reward_changes = {};

    //If amount is less than 1, give error
    if (reward.amount < 1)
      throw new Error("Sorry, this reward is no longer available");
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
    user.state = "COMPLETED"
    delete user._id;
    reward_changes["$push"] = { users_who_claimed_this_reward: user };

    const promised_rewards_change = Reward.findByIdAndUpdate(
      req.params.reward_id,
      reward_changes
    )

    //Add the value to the reward provider points
    const promised_reward_provider_change = User.findByIdAndUpdate(
      reward.reward_provider.id,
      { $inc: { points: reward.value } }
    )

    //Alter user object to make this reward collected. Note current time
    const promised_user_change = User.findOneAndUpdate(
      { _id: req.params.user_id, 'rewards.id': req.params.reward_id },
      { 'rewards.$.state': "COMPLETED", 'rewards.$.time': Date.now() }
    )

    //Email reward provider and reward collector that the transaction is done.
    // const promised_user_mail = mail.sendMail(user.email, "Reward transaction is completed", `Click <a href='${process.env.website}rewards/${reward._id}'>here</a> to rate the reward`);
    const promised_user_mail = mail.sendRewardTransactionCompleteNotice(user.email, reward._id);
    // const promised_reward_provider_mail = mail.sendMail(reward.reward_provider.email, "Your reward has been collected", `Click <a href='${process.env.website}rewards/${reward._id}'>here</a> to see the reward`);
    const promised_reward_provider_mail = mail.sendRewardcollectedNoticeToRewardProvider(reward.reward_provider.email, reward._id);

    await Promise.all([promised_user_mail, promised_reward_provider_mail, promised_rewards_change, promised_user_change, promised_reward_provider_change]);
    //Return success message
    res.json({ message: "Success" });
  } catch (err) {
    next(createError(400, err.message))
  }
});

router.put('/:id/enable/:state', async function (req, res, next) {
  //Only managers and admins can get here
  //Change the state of the act accordingly
  try {
    await Reward.findByIdAndUpdate(
      req.params.id,
      { 'enabled': req.params.state }
    )
    res.json({ message: "Success" });
  } catch (err) {
    next(createError(400, err.message))
  }
});

//Show rewards
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
    let search_text = { "$match": {} };
    if (req.query.search) {
      search = { '$text': { '$search': sanitize(req.query.search) } };
      search_text = { "$match": { '$text': { '$search': sanitize(req.query.search) } } };
    }
    // search = { 'users_under_review.id': { '$not': { $eq: req.user.id } } };

    //Act must be enabled
    const enabled = true



    let page = parseInt(sanitize(req.query.page));
    let act_type = sanitize(req.query.act_type);
    let sort = sanitize(req.query.sort);
    let type = sanitize(req.query.type);
    let order = parseInt(sanitize(req.query.order));
    const this_object = this;

    //This ensures that when an act poster tries to get his acts
    //Enabled and disabled acts are returned
    if (type != "MY_REWARDS")
      search.enabled = enabled;

    // if (type == "undefined")
    //     type = req.cookies.type;

    //If this is a manager, the default view should be All acts
    // if (req.roles && req.roles.manager)
    //   if (!type || globals.user_act_types.indexOf(type) === -1)
    //     type = "ALL";

    if (type == "ALL")
      delete search.enabled;
    else if (type == "ENABLED")
      search.enabled = true;
    else if (type == "DISABLED")
      search.enabled = false;

    if (!type || globals.user_act_types.indexOf(type) === -1)
      type = "AVAILABLE";



    //Deleted acts should not show up
    search['deleted'] = false;


    if (type == "AVAILABLE") {
      //Only return acts this user has not completed
      // search['users_under_review.id'] = { '$not': { $eq: req.user.id } };
      // search['completed_users.id'] = { '$not': { $eq: req.user.id } };
      search['users_who_claimed_this_reward'] = { '$not': { $elemMatch: { id: req.user.id, state: 'COMPLETED', state: "ON_GOING" } } }
    }
    else if (type == 'REQUESTED') {
      delete search.enabled;
      delete search.deleted;
      search['users_who_claimed_this_reward'] = {
        //Get acts where this user is in an on going state
        "$elemMatch": {
          id: req.user.id,
          state: "ON_GOING"
        },
        //but this user is not in a completed state as well
        "$not": {
          "$elemMatch": {
            id: req.user.id,
            state: "COMPLETED"
          }
        }
      }
      // search['users_who_claimed_this_reward.id'] = req.user.id;
    }
    else if (type == 'COLLECTED') {
      delete search.enabled;
      delete search.deleted;
      search['users_who_claimed_this_reward'] = {
        "$elemMatch": {
          id: req.user.id,
          state: "COMPLETED"
        }
      }
      // search['users_who_claimed_this_reward.id'] = req.user.id;
      // search['users_who_claimed_this_reward.state'] = "COMPLETED";
    }
    else if (type == 'CLOSED') {
      //Get rewards that have at least one user who has collected it
      search['users_who_claimed_this_reward.state'] = "COMPLETED";
    }
    else if (type == 'MY_REWARDS') {
      //Return all my non deleted rewards even if disabled or unavailable
      delete search.enabled;
      // delete search.deleted;
      search['reward_provider.id'] = req.user.id;
    }

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
    if (type != "MY_REWARDS")
      search.state = act_type;

    if (type == "COMPLETED" || type == "REQUESTED")
      delete search.state;

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
    const promised_acts = Reward.find(search).sort({ [sort]: order }).skip(offset).limit(10).lean();
    const promised_count = Reward.find(search).countDocuments();
    const promised_user_reward_points = User.findById(req.user.id, { points: true, _id: false });

    let promised_open_acts = null;
    let promised_open_acts_count = null;
    if (type == "OPEN") {
      //Get rewards that have a higher count of on going claims than completions
      promised_open_acts = Reward.aggregate([
        search_text,
        {
          $match: {
            users_who_claimed_this_reward: { $exists: true, $ne: [] },
          }
        },
        { $unwind: "$users_who_claimed_this_reward" },
        { $match: { 'users_who_claimed_this_reward.state': "ON_GOING" } },
        {
          $group: {
            _id: "$_id",
            reward: { $addToSet: "$$ROOT" },
            number_of_users_who_requested_this_reward: {
              "$sum": 1
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
          $addFields: { total_number_of_users_who_got_this_reward: "$reward.total_number_of_users_who_got_this_reward" }
        },
        {
          $project: {
            cmp: { $cmp: ["$number_of_users_who_requested_this_reward", "$total_number_of_users_who_got_this_reward"] },
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
            'reward.users_who_clicked_on_this_reward': false,
            'reward.users_who_claimed_this_reward': false,
            cmp: false
          }
        }
      ])

      promised_open_acts_count = Reward.aggregate([
        search_text,
        {
          $match: {
            users_who_claimed_this_reward: { $exists: true, $ne: [] },
          }
        },
        { $unwind: "$users_who_claimed_this_reward" },
        { $match: { 'users_who_claimed_this_reward.state': "ON_GOING" } },
        {
          $group: {
            _id: "$_id",
            reward: { $addToSet: "$$ROOT" },
            number_of_users_who_requested_this_reward: {
              "$sum": 1
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
          $addFields: { total_number_of_users_who_got_this_reward: "$reward.total_number_of_users_who_got_this_reward" }
        },
        {
          $project: {
            cmp: { $cmp: ["$number_of_users_who_requested_this_reward", "$total_number_of_users_who_got_this_reward"] },
            reward: true,
            _id: false
          }
        },
        { $match: { cmp: 1 } },
        { $count: 'count' }
      ])
    }



    let promises = [promised_acts, promised_count, promised_user_reward_points];
    if (type == "OPEN")
      promises.push(promised_open_acts, promised_open_acts_count);
    let acts;
    let count = 0;
    let reward_points;
    let result = {};
    let counter;
    await Promise.all(promises)
      .then(function (values) {
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
          if (values[4] && values[4][0])
            count = values[4][0].count;
          // acts = values[3];

          // acts.forEach(element => {
          //   if ()
          // });
          // console.log(acts);
        }
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
    let current_page = process.env.website + 'rewards?';

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
      reward_points,
      acts,
      type,
      current_page,
      act_count,
      query: req.query,
      count, title: "Rewards", acts, total_acts: total, user: req.user, roles: req.roles
    });

    // res.render('acts', { type, current_page, query: req.query, count, title: "Acts", acts, total_acts: total, user: req.user, roles: req.roles });
  }
  catch (err) {
    console.log(err)
    next(createError(400, err.message))
  }
})

//Show users relationships with rewards
router.get('/:id/details', async function (req, res, next) {

  try {

    let search = {};
    if (req.query.search)
      search = { '$text': { '$search': sanitize(req.query.search) } };

    let page = parseInt(sanitize(req.query.page));
    let act_type = sanitize(req.query.act_type);
    let sort = sanitize(req.query.sort);
    let order = parseInt(sanitize(req.query.order));
    let type = sanitize(req.query.type);

    //If type is not sent,
    //Make type open transactions
    if (!type || globals.reward_types.indexOf(type) === -1)
      type = "OPEN";

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


    let condition;
    //Open
    if (type == "OPEN")
      condition = "ON_GOING";
    //Closed
    else if (type == "CLOSED")
      condition = "COMPLETED";
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
          'rewards.$': true
        }
      ).sort({ [sort]: order }).skip(offset).limit(10).lean();

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
          'rewards.$': true
        }
      ).countDocuments();
    }

    if (type == "REVIEWS") {

      results = Reward.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
        { $unwind: "$reviews" },
        { $project: { "reviews": true } },
        { $sort: { 'reviews.time': -1 } },
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
      ])

      count = Reward.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
        { $unwind: "$reviews" },
        { $project: { "reviews": true } },
        { $sort: { 'reviews.time': -1 } },
        { $count: 'count' }
      ])
    }


    //Return the amount of points this reward has accumulated
    let points = User.aggregate([
      //Gets Acts this user has completed
      {
        $match: {
          'rewards.id': mongoose.Types.ObjectId(req.params.id)
        }
      },
      //Creates an array of many documents with a single (different) act in each one 
      { $unwind: '$rewards' },
      // //Gets the documents with the specified act.name
      { $match: { 'rewards.id': mongoose.Types.ObjectId(req.params.id) } },
      { $match: { 'rewards.state': 'COMPLETED' } },
      {
        $group: {
          _id: null, sum: {
            $sum: '$rewards.value'
          }
        }
      },
      { $project: { sum: 1, _id: 0 } }
    ]);

    let reward = Reward.findById(
      req.params.id,
      {
        users_who_clicked_on_this_reward: false,
        users_who_claimed_this_reward: false
      }
    )

    const promises = [results, count, points, reward]
    // let results, count, points
    let returned_results, pages, sum
    await Promise.all(promises)
      .then(function (values) {

        reward = values[3];

        if (type != "REVIEWS") {
          returned_results = values[0];
          count = values[1];
          pages = Math.ceil(count / 10);
          sum = 0;
          if (values[2][0])
            sum = values[2][0].sum;
        }
        else {
          returned_results = values[0][0].reviews;
          count = values[1][0].count;
          pages = Math.ceil(count / 10);
          sum = 0;
          if (values[2][0])
            sum = values[2][0].sum;
        }
      })
    res.json({ data: returned_results, count: pages, sum, reward })
  }
  catch (err) {
    console.log(err)
    next(createError(400, err.message))
  }
})

//Create act
router.post('/', async function (req, res, next) {

  try {
    if (!req.roles || !req.roles.act_poster) {
      throw new Error("You do not have authorization");
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
    if (!req.body.name || !req.body.description || !req.body.value || !req.body.amount)
      throw new Error("Incomplete request");

    const name = sanitize(req.body.name);
    const description = sanitize(req.body.description);
    const value = sanitize(req.body.value);
    const amount = sanitize(req.body.amount);

    if (!name || !description || !value || !amount)
      throw new Error("Incomplete request");

    const act = await Reward.findById(req.params.id);
    //Only the admin or act poster who uploaded this act can alter it
    if (!req.roles.administrator && req.user.id != act.reward_provider.id)
      throw new Error("You do not have authorization");

    act.enabled = false;
    act.name = name;
    act.description = description;
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

    const act = await Reward.findById(req.params.id);
    let new_state;

    if (act.enabled == true)
      new_state = false;
    else
      new_state = true;

    //Only the admin or act poster who uploaded this act can alter it
    if (!req.roles.administrator && req.user.id != act.reward_provider.id)
      throw new Error("You do not have authorization");

    act.enabled = new_state;
    await act.save();

    res.json({ message: "Success" });
  } catch (err) {
    next(createError(400, err.message))
  }

})

router.put('/:id/user_state', async function (req, res, next) {
  try {
    if (!req.roles || !req.roles.act_poster) {
      throw new Error("You do not have authorization");
    }

    const act = await Reward.findById(req.params.id);
    let new_state;

    if (act.state == 'AVAILABLE')
      new_state = 'NOT_AVAILABLE';
    else
      new_state = 'AVAILABLE';

    //Only the admin or act poster who uploaded this act can alter it
    if (!req.roles.administrator && req.user.id != act.reward_provider.id)
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

    const act = await Reward.findById(req.params.id);

    //Only the admin or act poster who uploaded this act can delete it
    if (!req.roles.administrator && req.user.id != act.reward_provider.id)
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
