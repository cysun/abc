"use strict";
const mongoose = require("mongoose");

let subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    trim: true,
    sparse: true
  },
  creation_date: {
    type: Date,
    default: Date.now
  },
  enabled: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("Subscriber", subscriberSchema);
