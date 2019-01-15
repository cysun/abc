"use strict";
const mongoose = require("mongoose");
const globals = require("../globals");
const fs = require("fs");
const nodemailer = require("nodemailer");
const sanitize = require("sanitize-html");
sanitize.defaults.allowedAttributes = [];
sanitize.defaults.allowedTags = [];
const passwordValidator = require("password-validator");
const randomstring = require("randomstring");
const util = require("util");
const fs_read_file = util.promisify(fs.readFile);
const bcrypt = require("bcryptjs");
const schema = new passwordValidator();
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

let actSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    sparse: true
  },
  description: {
    type: String,
    required: true,
    sparse: true
  },
  reward_points: {
    type: Number,
    required: true,
    sparse: true
  },
  state: {
    type: String,
    enum: ["AVAILABLE", "NOT_AVAILABLE"],
    required: true,
    default: "AVAILABLE"
  },
  deleted: {
    type: Boolean,
    default: false
  },
  creation_date: {
    type: Date,
    default: Date.now
  },
  image: {
    type: String,
    default: "http://localhost:3000/images/banner1.jpg"
  },
  act_provider: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      sparse: true
    },
    first_name: {
      type: String,
      required: true,
      sparse: true
    },
    last_name: {
      type: String,
      required: true,
      sparse: true
    }
  },
  tags: [
    {
      name: {
        type: String,
        lowercase: true,
        trim: true
      }
    }
  ],
  users_who_clicked_on_this_act: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        sparse: true
      },
      first_name: {
        type: String,
        required: true,
        sparse: true
      },
      last_name: {
        type: String,
        required: true,
        sparse: true
      },
      time_clicked: {
        type: Date,
        default: Date.now
      }
    }
  ],
  total_number_of_clicks: {
    type: Number,
    default: 0
  },
  users_who_completed_this_act: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        sparse: true
      },
      first_name: {
        type: String,
        required: true,
        sparse: true
      },
      last_name: {
        type: String,
        required: true,
        sparse: true
      },
      state: {
        type: String,
        enum: ["UNDER_REVIEW", "COMPLETED", "REJECTED"],
        required: true,
        default: "UNDER_REVIEW"
      },
      submit_time: {
        type: Date,
        default: Date.now
      },
      time_completed: {
        type: Date,
        default: Date.now
      },
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
      ],
      review_of_proof: {
        reviewer_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        reviewer_name: String,
        time_of_review: {
          type: Date
          // default: Date.now
        },
        result: Boolean,
        comments: String
      }
    }
  ],
  users_under_review: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        sparse: true
      },
      first_name: {
        type: String,
        required: true,
        sparse: true
      },
      last_name: {
        type: String,
        required: true,
        sparse: true
      },
      time: {
        type: Date,
        default: Date.now
      },
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
  rejected_users: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        sparse: true
      },
      first_name: {
        type: String,
        required: true,
        sparse: true
      },
      last_name: {
        type: String,
        required: true,
        sparse: true
      },
      time: {
        type: Date,
        default: Date.now
      },
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
      ],
      review_of_proof: {
        reviewer_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        reviewer_name: String,
        time_of_review: {
          type: Date,
          default: Date.now
        },
        comments: String
      }
    }
  ],
  completed_users: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        sparse: true
      },
      first_name: {
        type: String,
        required: true,
        sparse: true
      },
      last_name: {
        type: String,
        required: true,
        sparse: true
      },
      time: {
        type: Date,
        default: Date.now
      },
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
      ],
      review_of_proof: {
        reviewer_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        reviewer_name: String,
        time_of_review: {
          type: Date,
          default: Date.now
        }
      }
    }
  ],
  total_number_of_completions: {
    type: Number,
    default: 0
  },
  enabled: {
    state: {
      type: Boolean,
      default: false
    },
    manager_who_processed_this_act: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      first_name: String,
      last_name: String,
      time_processed: {
        type: Date
        // default: Date.now
      }
    }
  }
});

actSchema.index(
  {
    name: "text",
    description: "text"
  },
  {
    name: "Acts index",
    weights: { name: 10, description: 1 }
  }
);

actSchema.index({ _id: 1, "users_under_review.id": 1 }, { unique: true });

actSchema.index({ _id: 1, "completed_users.id": 1 }, { unique: true });

actSchema.index({ _id: 1, "rejected_users.id": 1 }, { unique: true });

actSchema.index({ _id: 1, "tags.name": 1 }, { unique: true });

actSchema.methods.getActs = async function(params) {
  //Get acts (paginated)
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

// //Find user with ID
// userSchema.statics.findByID = function (id, callback) {
//     return this.findOne({
//         _id: id
//     },
//         callback
//     );
// };

// //Find user with email
// userSchema.statics.findByEmail = function (email) {
//     return this.findOne({ email: email });
// };

//Don't delete this code
// actSchema.statics.getUniqueImageName = async function (length_of_random_string = 32) {
//     let result;
//     let random_name;
//     let value;
//     do {
//         random_name = randomstring.generate(length_of_random_string);
//         value =
//             process.env.website + process.env.display_act_picture_folder + random_name + ".png";
//         result = await this.findOne({
//             image: value
//         });
//     } while (result != null);
//     return random_name;
// };
actSchema.statics.getUniqueImageName = async function(
  length_of_random_string = 32
) {
  return uuidv4();
};
//Don't delete this
// actSchema.statics.getUniqueProofImageName = async function (length_of_random_string = 32) {
//     let result;
//     let random_name;
//     let value;
//     do {
//         random_name = randomstring.generate(length_of_random_string);
//         value =
//             process.env.website + process.env.display_act_picture_folder + random_name;
//         result = await this.findOne({
//             'proof_of_completion.new_name': { "$regex": value, "$options": "i" }
//         });
//     } while (result != null);
//     return random_name;
// };

actSchema.statics.getUniqueProofImageName = async function(
  length_of_random_string = 32
) {
  return uuidv4();
};

//Create user with input data
actSchema.statics.initialize = async function(data) {
  let act = new this({});

  if (!data.name || !data.description || !data.reward_points)
    throw new Error("Incomplete request");

  // Sanitize all required fields
  let name = sanitize(data.name);
  let description = sanitize(data.description);
  let reward_points = parseInt(sanitize(data.reward_points));

  //Make sure all required fields were sent,
  //If not, return error
  if (!name || !description || !reward_points)
    throw new Error("Incomplete request");

  //If picture was uploaded, make sure it's a valid image
  let file_name = null;
  let error_drawing_file = false;
  if (data.profile_picture) {
    let buffer;
    await this.getUniqueImageName()
      .then(function(random_file_name) {
        //Check for a unique file name
        file_name = random_file_name;
      })
      .then(async function() {
        await fs_read_file(data.picture).then(function(data) {
          buffer = data;
        });
      })
      .then(async function() {
        await sharp(buffer).toFile(
          "static/" + process.env.files_folder + file_name + ".png"
        );
      })
      .catch(function(error) {
        error_drawing_file = true;
      })
      .then(function() {
        //Attach profile picture to user
        act.image =
          process.env.website + process.env.files_folder + file_name + ".png";
      });
  }

  if (error_drawing_file) throw new Error("Invalid image");

  act.name = name;
  act.description = description;
  act.reward_points = reward_points;
  act.act_provider = {
    id: data.provider.id,
    first_name: data.provider.first_name,
    last_name: data.provider.last_name
  };
  return act;
};

// //Attach profile picture
// userSchema.methods.attachProfilePicture = async function (profile_picture) {
//     //Check for a unique file name
//     let file_name;
//     let buffer;
//     const previous_image = process.env.profile_picture_folder + this.profile_picture.replace(process.env.website + process.env.display_picture_folder, '');
//     var error_drawing_file = false;
//     let user;
//     let this_user = this;
//     await this.model('User').getUniqueName("profile_picture")
//         .then(function (random_file_name) {
//             file_name = random_file_name;
//         })
//         .then(async function () {
//             await fs_read_file(profile_picture).then(function (data) { buffer = data });
//         })
//         .then(async function () {
//             await sharp(buffer).toFile(process.env.profile_picture_folder + file_name + ".png")
//         })
//         .then(async function () {
//             //If all goes well, delete the previous image
//             fs.unlink(previous_image);
//             //Attach new profile picture to user
//             // user = await this_user.model('User').findByIdAndUpdate(
//             //     this_user._id,
//             //     { profile_picture: process.env.website + process.env.display_picture_folder + file_name + ".png" },
//             //     { new: true }
//             // )
//             this_user.profile_picture = process.env.website + process.env.display_picture_folder + file_name + ".png";
//         })
//         .catch(function (error) {
//             if (error) {
//                 console.log(error);
//                 error_drawing_file = true;
//             }
//         })

//     //Always delete the uploaded file
//     fs.unlink(profile_picture);

//     if (error_drawing_file)
//         throw new Error("Invalid Image");
// }

// userSchema.methods.sendVerificationEmail = async function () {
//     let error_occured = false;
//     // Generate unique verification token
//     const verification_token = await this.model('User').getUniqueName("email_verification_token", 70);
//     // Send email to the given address for verification
//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: process.env.email_address,
//             pass: process.env.email_password
//         }
//     });

//     const mailOptions = {
//         from: process.env.email_address,
//         to: this.unverified_email,
//         subject: 'Verify your account',
//         html: `<p>Click <a href='${process.env.website}verify/${verification_token}'>here</a> to verify your account on ABC</p>`
//     };

//     await transporter.sendMail(mailOptions, function (error, info) {
//         if (error)
//             error_occured = true;
//     });
//     if (error_occured)
//         throw new Error("Something went wrong. Please try again later");

//     this.email_verification_token = verification_token;
// };

// userSchema.methods.deleteProfilePicture = async function () {
//     //If there is a profile picture
//     if (this.profile_picture) {
//         //Delete it
//         fs.unlink(process.env.profile_picture_folder + this.profile_picture.replace(process.env.website + process.env.display_picture_folder, ''));
//         //Assign null to this profile picture
//         this.profile_picture = null;
//     }
// }

// userSchema.methods.deleteUser = async function () {
//     //Move the user's email to the deleted_user_email
//     this.deleted_user_email = this.email;
//     this.email = null;
//     //Make enabled bit false
//     this.enabled = false;
// }

// userSchema.methods.sendPasswordResetInstructions = async function () {
//     let error_occured = false;
//     //Get unique password reset token
//     const password_reset_token = await this.model('User').getUniqueName("reset_tokens", 70);
//     //Send password reset instructions to the user
//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: process.env.email_address,
//             pass: process.env.email_password
//         }
//     });

//     const mailOptions = {
//         from: process.env.email_address,
//         to: this.email,
//         subject: 'Reset your password',
//         html: `<p>Click <a href='${process.env.website}reset/${password_reset_token}'>here</a> to reset your password on ABC</p>`
//     };

//     await transporter.sendMail(mailOptions, function (error, info) {
//         if (error)
//             error_occured = true;
//     });
//     if (error_occured)
//         throw new Error("Something went wrong. Please try again later");

//     //Add it to this user's reset tokens
//     this.reset_tokens.push(password_reset_token);
// }

// userSchema.methods.getActs = async function (params) {
//     //Get user's acts (paginated)
//     if (!params.page || params.page < 1)
//         params.page = 1
//     offset = (params.page - 1) * 10;

//     let search = sanitize(params.search);
//     let sort = sanitize(params.sort);
//     let order = sanitize(params.order);

//     //Get the acts of this user (10)
//     let search_condition = "";
//     let sort_condition = "_id";
//     let order_condition = 1;

//     //If there is a search query
//     if (search) {
//         search_condition = "MATCH (title) AGAINST (:title) AND";
//     }
//     if ($sort == "title")
//         $sort_condition = "title";
//     if ($order == "DESC")
//         $order_condition = "DESC";

//     try {
//         $sql = "SELECT id, creator_id, title FROM user_keys WHERE $search_condition creator_id =:creator_id ORDER BY $sort_condition $order_condition LIMIT 10 OFFSET $offset;";
//         $sql.= "SELECT COUNT(*) AS total_results FROM user_keys WHERE $search_condition creator_id =:creator_id;";
//         $stmt = $con -> prepare($sql);
//         if (!empty($search))
//             $stmt -> bindValue('title', $search, PDO:: PARAM_STR);
//         $stmt -> bindValue('creator_id', $this -> id, PDO:: PARAM_INT);
//         $stmt -> execute();
//         while ($row = $stmt -> fetch(PDO:: FETCH_ASSOC)) {
//             $contents[] = $row;
//         }
//         $stmt -> nextRowset();
//         $row = $stmt -> fetch(PDO:: FETCH_ASSOC);
//         $results['total_results'] = $row['total_results'];
//         $results['keys'] = $contents;
//         $stmt -> closeCursor();
//     } catch (Exception $e) {
//         throw new Exception(L:: something_went_wrong_please_try_again_later, 500);
//     }
//     return $results;
// }

//     public function getContents($con, $page) {
//         //If page is less than 1, error
//         if ($page < 1)
//             throw new Exception(L::invalid_details, 400);
//         $offset = ($page - 1) * 10;

//         $search = filter_var($_GET['search'], FILTER_SANITIZE_STRING);
//         $type = filter_var($_GET['type'], FILTER_SANITIZE_STRING);
//         $sort = filter_var($_GET['sort'], FILTER_SANITIZE_STRING);
//         $order = filter_var($_GET['order'], FILTER_SANITIZE_STRING);

//         //Get the contents of this user (10)
//         //Can search title, type
//         //Can sort title, type, last_modified, id
//         //Can order sort asc, desc

//         $search_condition = "";
//         $sort_condition = "id";
//         $order_condition = "ASC";
//         if (!empty($type)) {
//             $search_condition .= "type =:type AND ";
//         }
//         if (!empty($search)) {
//             $search_condition .= "MATCH (title) AGAINST (:title) AND ";
//         }
//         if ($sort != "title" && $sort != "type" && $sort != "last_modified" && $sort != "id")
//             $sort_condition = "id";
//         else
//             $sort_condition = $sort;
//         if ($order == "DESC")
//             $order_condition = "DESC";

//         try {
//             $sql = "SELECT * FROM contents WHERE $search_condition creator_id =:creator_id ORDER BY $sort_condition $order_condition LIMIT 10 OFFSET $offset;";
//             $sql .= "SELECT COUNT(*) AS total_results FROM contents WHERE $search_condition creator_id =:creator_id;";
//             $stmt = $con->prepare($sql);
//             if (!empty($search))
//                 $stmt->bindValue('title', $search, PDO::PARAM_STR);
//             if (!empty($type))
//                 $stmt->bindValue('type', $type, PDO::PARAM_STR);
//             $stmt->bindValue('creator_id', $this->id, PDO::PARAM_INT);
//             $stmt->execute();

//             while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
//                 $row['content_link'] = HOMEPAGE . $row['content_link'];
//                 $contents[] = $row;
//             }
//             $results["contents"] = $contents;
//             $stmt->nextRowset();
//             $row = $stmt->fetch(PDO::FETCH_ASSOC);
//             $results['total_results'] = $row['total_results'];
//             $stmt->closeCursor();
//         } catch (Exception $e) {
//             throw new Exception(L::something_went_wrong_please_try_again_later, 500);
//         }
//         return $results;
//     }

module.exports = mongoose.model("Act", actSchema);
