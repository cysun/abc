"use strict";
const mongoose = require("mongoose");
const sanitize = require("sanitize-html");
sanitize.defaults.allowedAttributes = [];
sanitize.defaults.allowedTags = [];
const passwordValidator = require("password-validator");
const schema = new passwordValidator();
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
    image: {
        type: String
      },
    deleted: {
        type: Boolean,
        required: true,
        default: false
    },
    creation_date: {
        type: Date,
        default: Date.now
    },
    state: {
        type: String,
        enum: ['AVAILABLE', 'NOT_AVAILABLE'],
        required: true,
        default: 'AVAILABLE'
    },
    enabled: {
        type: Boolean,
        required: true,
        default: false
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
        email: {
            type: String,
            required: true,
            sparse: true
        }
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
        time: {
            type: Date,
            default: Date.now
        }
    }],
    total_number_of_users_who_clicked_on_this_reward: {
        type: Number,
        default: 0
    },
    total_number_of_users_who_got_this_reward: {
        type: Number,
        default: 0
    },
    reviews: [{
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
        reward_rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        reward_comments: String,
        reward_provider_rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        reward_provider_comments: String,
        time: {
            type: Date,
            default: Date.now
        },
    }]
});

rewardSchema.index(
    {
        'name': 'text'
    },
    {
        name: 'Rewards full text index',
        weights: { 'name': 1 }
    }
)

//Create reward with input data
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

module.exports = mongoose.model("Reward", rewardSchema);