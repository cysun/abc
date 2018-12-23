"use strict";
const mongoose = require("mongoose");
const Act = require("./Act");

const Event_Act = Act.discriminator('Event', new mongoose.Schema({
    start_time: {
        type: Date,
        required: true
    },
    end_time: {
        type: Date,
        required: true
    }
}))
module.exports = Event_Act;