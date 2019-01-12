"use strict";
const mongoose = require("mongoose");

let fileSchema = new mongoose.Schema({
  uploader_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    sparse: true
  },
  act_proof_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  user_proof_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  original_name: {
    type: String,
    required: true,
    unique: true
  },
  size: {
    type: number,
    required: true
  },
  upload_time: {
    time: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("File", fileSchema);
