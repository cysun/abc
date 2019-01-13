"use strict";
const mongoose = require("mongoose");

let fileSchema = new mongoose.Schema({
  uploader_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    sparse: true
  },
  proof_name: {
    type: String,
    unique: true
  },
  original_name: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  upload_time: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("File", fileSchema);
