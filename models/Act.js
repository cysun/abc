"use strict";
const mongoose = require("mongoose");
const globals = require("../globals");
const fs = require("fs");
const sanitize = require("sanitize-html");
const FileSchema = require("./File");
sanitize.defaults.allowedAttributes = [];
sanitize.defaults.allowedTags = [];
const passwordValidator = require("password-validator");
const util = require("util");
const cheerio = require("cheerio");
const fs_read_file = util.promisify(fs.readFile);
const schema = new passwordValidator();
const uuidv4 = require("uuid/v4");
const base64Img = require("base64-img-promise");
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
    required: true
  },
  repeatable: {
    type: Boolean,
    default: false
  },
  importance: {
    type: Number,
    default: 0
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
  amount: {
    type: Number,
    default: 0
  },
  expiration_date: Date,
  image: {
    type: String
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
    },
    email: {
      type: String,
      required: true
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
      },
      user_review_of_act: {
        act_rating: {
          type: Number,
          min: 1,
          max: 5
        },
        act_comments: String,
        time: {
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
      }
    }
  }
});

actSchema.index(
  {
    name: "text"
  },
  {
    name: "Acts full text index",
    weights: { name: 1 }
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

actSchema.statics.getUniqueImageName = async function(
  length_of_random_string = 32
) {
  return uuidv4();
};

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
  let description = data.description;
  let how_to_submit_evidences = data.how_to_submit_evidences;
  let reward_points = parseInt(sanitize(data.reward_points));

  //Check if there are images in the description
  const re = /(?:\.([^.]+))?$/;
  let $ = cheerio.load(description);
  if ($("img").length > 0) {
    let ext;
    const image_promises = [];
    const image_names = [];
    const file_details = [];
    //Look for all images in the description
    const images = $("img");
    // console.log(images.length);
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
      $("img")[i].attribs["src"] = "/api/acts/images/" + image_names[i];
      file_details.push({
        uploader_id: mongoose.Types.ObjectId(data.provider.id),
        proof_name: image_names[i],
        upload_time: new Date(),
        original_name: images[i].attribs["data-filename"],
        size: fs.statSync(`${process.env.files_folder}/${image_names[i]}`).size
      });
      console.log($("img")[i].attribs["src"]);
    }
    // console.log($.html())
    let new_description = $.html();
    new_description = new_description.split("<body>")[1];
    new_description = new_description.split("</body>")[0];
    description = new_description;
    console.log(description);
    //Insert these new files into the file schema
    if (file_details.length > 0)
      await FileSchema.collection.insertMany(file_details);
  }

  //Make sure all required fields were sent,
  //If not, return error
  if (!name || !description || !reward_points)
    throw new Error("Incomplete request");

  if (data.expiration_date) act.expiration_date = data.expiration_date;
  //If picture was uploaded, make sure it's a valid image
  let file_name = null;
  let error_drawing_file = false;
  if (data.picture) {
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
        await sharp(buffer)
          .resize(1600, 800)
          .toFile(`${process.env.files_folder}/${file_name}.png`);
      })
      .catch(function(error) {
        error_drawing_file = true;
      })
      .then(function() {
        //Attach profile picture to user
        act.image = `${file_name}.png`;
      });
  }

  if (error_drawing_file) throw new Error("Invalid image");

  act.name = name;
  act.description = description;
  act.reward_points = reward_points;
  if (data.amount == "") data.amount = -1;
  act.amount = data.amount;
  act.repeatable = data.repeatable;
  act.importance = data.importance;
  act.act_provider = {
    id: data.provider.id,
    first_name: data.provider.first_name,
    last_name: data.provider.last_name,
    email: data.provider.email
  };
  return act;
};
module.exports = mongoose.model("Act", actSchema);