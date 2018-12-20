"use strict";
const mongoose = require("mongoose");
const globals = require("../globals");
const fs = require("fs");
const nodemailer = require('nodemailer');
const sanitize = require("sanitize-html");
sanitize.defaults.allowedAttributes = [];
sanitize.defaults.allowedTags = [];
const passwordValidator = require("password-validator");
const randomstring = require("randomstring");
const util = require("util");
const fs_read_file = util.promisify(fs.readFile);
const bcrypt = require("bcryptjs");
const schema = new passwordValidator();
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

let rewardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        default: 1
    },
    reward_provider: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
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
    },
    users_who_clicked_on_this_reward: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
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
    }],
    users_who_claimed_this_reward: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
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
            enum: ['ON_GOING', 'COMPLETED'],
            required: true,
            default: 'ON_GOING'
        },
        time_completed: {
            type: Date,
            default: Date.now
        }
    }]
});

rewardSchema.index(
    {
        'name': 'text',
        'description': 'text'
    },
    {
        name: 'Rewards index',
        weights: { 'name': 2, 'description': 1 }
    }
)

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

// userSchema.statics.getUniqueName = async function (name, length_of_random_string = 32) {
//     let result;
//     let random_name;
//     let value;
//     do {
//         random_name = randomstring.generate(length_of_random_string);
//         if (name == "profile_picture")
//             value =
//                 globals.website + globals.display_picture_folder + random_name + ".png";
//         else value = random_name;
//         result = await this.findOne({
//             [name]: value
//         });
//     } while (result != null);
//     return random_name;
// };

// //Create reward with input data
rewardSchema.statics.initialize = async function (data) {

    // Sanitize all required fields
    let name = sanitize(data.name);
    let description = sanitize(data.description);
    let value = parseInt(sanitize(data.value));

    //Make sure all required fields were sent,
    //If not, return error
    if (!name || !description || !value)
        throw new Error("Incomplete request");


    return new this({
        name,
        description,
        value
    });
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

module.exports = mongoose.model("Reward", rewardSchema);