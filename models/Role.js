"use strict";
const mongoose = require("mongoose");

let roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        sparse: true
    }
});
module.exports = mongoose.model("Role", roleSchema);