"use strict";
const mongoose = require("mongoose");

let certificateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true,
        unique: true
    }
});
module.exports = mongoose.model("Certificate", certificateSchema);