"use strict";
const mongoose = require("mongoose");

let tagSchema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique: true,
        sparse: true
    }
});
module.exports = mongoose.model("Tag", tagSchema);