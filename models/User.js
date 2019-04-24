"use strict";
const mongoose = require("mongoose");
const globals = require("../globals");
const fs = require("fs");
const sanitize = require("sanitize-html");
sanitize.defaults.allowedAttributes = [];
sanitize.defaults.allowedTags = [];
const passwordValidator = require("password-validator");
const util = require("util");
const fs_read_file = util.promisify(fs.readFile);
const bcrypt = require("bcryptjs");
const schema = new passwordValidator();
const Act = require("./Act");
const uuidv4 = require("uuid/v4");
const sharp = require("sharp");
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

let userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    trim: true,
    sparse: true
  },
  unverified_email: {
    type: String,
    trim: true,
    sparse: true
  },
  deleted_user_email: String,
  email_verification_token: {
    type: String,
    unique: true,
    sparse: true
  },
  password_reset_token: {
    type: String,
    unique: true,
    sparse: true
  },
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  profile_picture: String,
  creation_date: {
    type: Date,
    default: Date.now
  },
  refresh_token: {
    type: String,
    unique: true
  },
  reset_tokens: [
    {
      token: {
        type: String,
        unique: true,
        sparse: true
      }
    }
  ],
  roles: [
    {
      name: {
        type: String,
        required: true,
        ref: "Role",
        sparse: true
      }
    }
  ],
  points_given_by_admin: [
    {
      amount: {
        type: Number,
        required: true
      },
      reason: {
        type: String,
        required: true
      },
      time: {
        type: Date,
        default: Date.now
      },
      given_by: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        first_name: {
          type: String,
          required: true
        },
        last_name: {
          type: String,
          required: true
        }
      }
    }
  ],
  acts: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Act",
        required: true,
        sparse: true
      },
      state: {
        type: String,
        enum: ["UNDER_REVIEW", "COMPLETED", "REJECTED"],
        required: true,
        default: "UNDER_REVIEW"
      },
      comments: String,
      time: Date,
      proof_of_completion: [
        {
          original_name: {
            type: String
          },
          new_name: {
            type: String,
            unique: true,
            sparse: true
          }
        }
      ]
    }
  ],
  rewards: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reward"
      },
      name: String,
      description: String,
      value: Number,
      reward_rating: {
        type: Number,
        min: 1,
        max: 5
      },
      reward_provider_rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comments: String,
      state: {
        type: String,
        enum: ["ON_GOING", "COMPLETED"],
        required: true,
        default: "ON_GOING"
      },
      time: {
        type: Date,
        default: Date.now
      }
    }
  ],
  points: {
    type: Number,
    default: 0
  },
  enabled: {
    type: Boolean,
    default: false
  }
});

userSchema.index(
  {
    first_name: "text",
    last_name: "text"
  },
  {
    name: "User name index",
    weights: { first_name: 1, last_name: 2 }
  }
);

//Find user with ID
userSchema.statics.findByID = function(id, callback) {
  return this.findOne(
    {
      _id: id
    },
    callback
  );
};

//Find user with email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email });
};

userSchema.statics.getUniqueName = async function(
  name,
  length_of_random_string = 32
) {
  return uuidv4();
};

//Create user with input data
userSchema.statics.initialize = async function(data) {
  let user = new this({});

  if (!data.email || !data.first_name || !data.last_name || !data.password)
    throw new Error("Incomplete request");

  // Sanitize all required fields
  let email = sanitize(data.email);
  let first_name = sanitize(data.first_name);
  let last_name = sanitize(data.last_name);

  //Make sure all required fields were sent,
  //If not, return error
  if (!email || !first_name || !last_name || !data.password)
    throw new Error("Incomplete request");

  let promises = [];

  //Check if input email already exists
  let check_email = this.findByEmail(email);
  promises.push(check_email);

  //Make sure password is strong enough
  //If not, give error
  if (!schema.validate(data.password))
    throw new Error(
      "Password must have at least 8, and at most 30 characters. Password must also have at least one number, uppercase, lowercase letter and one symbol."
    );

  //If profile picture was uploaded, make sure it's a valid image
  let file_name = null;
  if (data.profile_picture) {
    let buffer;
    var error_drawing_file = false;
    const draw_file = this.getUniqueName("profile_picture")
      .then(function(random_file_name) {
        //Check for a unique file name
        file_name = random_file_name;
      })
      .then(async function() {
        await fs_read_file(data.profile_picture).then(function(data) {
          buffer = data;
        });
      })
      .then(async function() {
        await sharp(buffer).toFile(
          `${process.env.files_folder}/${file_name}.png`
        );
      })
      .catch(function(error) {
        error_drawing_file = true;
      })
      .then(function() {
        //Attach profile picture to user
        user.profile_picture = file_name + ".png";
      });
    promises.push(draw_file);
  }

  //Hash the password
  const promised_hashed_password = bcrypt
    .hash(data.password, 12)
    .then(function(hash) {
      user.password = hash;
    });

  promises.push(promised_hashed_password);
  //Get refresh_token
  const get_refresh_token_promise = this.getUniqueName("refresh_token", 100);
  promises.push(get_refresh_token_promise);
  const last_promise_id = promises.length - 1;

  await Promise.all(promises)
    .then(function(values) {
      if (values[0] != null) throw new Error("Email already exists");
      if (error_drawing_file) {
        throw new Error("Invalid image");
      }
      user.refresh_token = values[last_promise_id];
    })
    .catch(function(error) {
      if (file_name && error_drawing_file === false)
        fs.unlinkSync(
          "static/" + process.env.files_folder + file_name + ".png"
        );
      throw new Error(error.message);
    });

  //If all checks out, attach details to user
  user.unverified_email = email;
  user.first_name = first_name;
  user.last_name = last_name;

  return user;
};

//Attach profile picture
userSchema.methods.attachProfilePicture = async function(profile_picture) {
  //Check for a unique file name
  let file_name;
  let buffer;
  const previous_image =
    "static/" +
    process.env.files_folder +
    this.profile_picture.replace(
      process.env.website + process.env.files_folder,
      ""
    );
  var error_drawing_file = false;
  let user;
  let this_user = this;
  await this.model("User")
    .getUniqueName("profile_picture")
    .then(function(random_file_name) {
      file_name = random_file_name;
    })
    .then(async function() {
      await fs_read_file(profile_picture).then(function(data) {
        buffer = data;
      });
    })
    .then(async function() {
      await sharp(buffer).toFile(
        "static/" + process.env.files_folder + file_name + ".png"
      );
    })
    .then(async function() {
      //If all goes well, delete the previous image
      fs.unlink(previous_image);
      //Attach new profile picture to user
      this_user.profile_picture =
        process.env.website + process.env.files_folder + file_name + ".png";
    })
    .catch(function(error) {
      if (error) {
        console.log(error);
        error_drawing_file = true;
      }
    });

  //Always delete the uploaded file
  fs.unlink(profile_picture);

  if (error_drawing_file) throw new Error("Invalid Image");
};

userSchema.methods.deleteProfilePicture = async function() {
  //If there is a profile picture
  if (this.profile_picture) {
    //Delete it
    fs.unlink(
      "static/" +
        process.env.files_folder +
        this.profile_picture.replace(
          process.env.website + process.env.files_folder,
          ""
        )
    );
    //Assign null to this profile picture
    this.profile_picture = null;
  }
};

userSchema.methods.deleteUser = async function() {
  //Move the user's email to the deleted_user_email
  this.deleted_user_email = this.email;
  this.email = null;
  //Make enabled bit false
  this.enabled = false;
};

userSchema.methods.getActs = async function(params) {
  //Get user's acts (paginated)
  let search;
  let page = parseInt(sanitize(params.page));
  let act_type = sanitize(params.act_type);
  if (params.search) search = sanitize(params.search);
  let sort = sanitize(params.sort);
  let order = parseInt(sanitize(params.order));
  const this_object = this;

  //Handle invalid page
  if (!page || page < 1) page = 1;

  //Handle invalid act type
  if (!act_type || globals.user_act_types.indexOf(act_type) === -1)
    act_type = "UNDER_REVIEW";

  //Handle invalid act sort category
  if (!sort || globals.user_acts_sort_categories.indexOf(sort) === -1)
    sort = "name";

  //Handle invalid act order category
  if (!order || globals.user_acts_order_categories.indexOf(order) === -1)
    order = 1;

  let offset = (page - 1) * 10;

  //Get the requested acts of this user (10)
  let search_condition = {};

  //If there is a search query
  if (search) {
    search_condition = { $text: { $search: search } };
  }

  let results = Act.aggregate([
    //Gets Acts this user has completed
    {
      $match: {
        $and: [
          { "users_who_completed_this_act.id": this._id },
          search_condition
        ]
      }
    },
    //Creates an array of many documents with a single (different) act in each one
    { $unwind: "$users_who_completed_this_act" },
    // //Gets the documents with the specified act.name
    { $match: { "users_who_completed_this_act.id": this._id } },
    // { $group: { _id: null, acts: { $push: "$$ROOT" }, count: { $sum: 1 } } },
    { $skip: offset },
    { $limit: 10 },
    { $sort: { [sort]: -1 } },
    // //Removes the _id
    { $project: { _id: 0 } }
  ]);

  let count = Act.aggregate([
    //Gets Acts this user has completed
    {
      $match: {
        $and: [
          { "users_who_completed_this_act.id": this._id },
          search_condition
        ]
      }
    },
    //Creates an array of many documents with a single (different) act in each one
    { $unwind: "$users_who_completed_this_act" },
    // //Gets the documents with the specified act.name
    { $match: { "users_who_completed_this_act.id": this._id } },
    { $group: { _id: null, count: { $sum: 1 } } }
  ]);

  let promises = [results, count];
  let result = {};
  let counter;
  await Promise.all(promises).then(function(values) {
    result.result = values[0];
    result.total_count = values[1][0]["count"];
  });
  return result;
};

module.exports = mongoose.model("User", userSchema);
