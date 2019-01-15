"use strict";
const mongoose = require("mongoose");
const Role = require("../models/Role");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
require("dotenv").load();

async function insertIntoDatabase() {
  mongoose.connect(
    process.env.REPLICA_SET,
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      replicaSet: "rs"
    }
  );

  const act_poster = new Role({
    name: "Act Poster"
  });

  const reward_provider = new Role({
    name: "Reward Provider"
  });

  const manager = new Role({
    name: "Manager"
  });

  let admin = new Role({
    name: "Administrator"
  });

  let promises = [
    act_poster.save(),
    reward_provider.save(),
    manager.save(),
    admin.save()
  ];
  await Promise.all(promises);

  const password = "password";
  const email = "admin@email.com";
  const first_name = "admin_first_name";
  const last_name = "admin_last_name";

  const promised_refresh_token = User.getUniqueName("refresh_token", 100);
  const promised_hashed_password = bcrypt.hash(password, 12);
  // const promised_admin_role = Role.findOne({ name: "Administrator" });

  // const promises = [promised_refresh_token, promised_hashed_password, promised_admin_role];
  promises = [promised_refresh_token, promised_hashed_password];

  let refresh_token;
  let hashed_password;

  await Promise.all(promises).then(function(values) {
    refresh_token = values[0];
    hashed_password = values[1];
  });

  admin = new User({
    creation_date: new Date(),
    reset_tokens: [],
    roles: [
      {
        name: "Administrator"
      }
    ],
    points: 0,
    enabled: true,
    acts_completed: [],
    rewards: [],
    password: hashed_password,
    refresh_token: refresh_token,
    email: email,
    first_name: first_name,
    last_name: last_name
  });

  await admin.save();

  await mongoose.disconnect();
}

insertIntoDatabase();
