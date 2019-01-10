'use strict'
const mongoose = require('mongoose');
const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require("bcryptjs");

async function insertIntoDatabase() {

    mongoose.connect("mongodb://DESKTOP-P2ELC2L:27017,DESKTOP-P2ELC2L:27018,DESKTOP-P2ELC2L:27019/ABC", {
        useCreateIndex: true,
        useNewUrlParser: true,
        replicaSet: 'rs'
    });

    const password = "password"
    const email = "admin@email.com";
    const first_name = "admin_first_name";
    const last_name = "admin_last_name";

    const promised_refresh_token = User.getUniqueName("refresh_token", 100);
    const promised_hashed_password = bcrypt.hash(password, 12)
    // const promised_admin_role = Role.findOne({ name: "Administrator" });

    // const promises = [promised_refresh_token, promised_hashed_password, promised_admin_role];
    const promises = [promised_refresh_token, promised_hashed_password];

    let refresh_token;
    let hashed_password;

    await Promise.all(promises)
        .then(function (values) {
            refresh_token = values[0];
            hashed_password = values[1];
        })

    const admin = new User({
        "creation_date": new Date(),
        "reset_tokens": [],
        "roles": [
            {
                name: 'Administrator'
            }
        ],
        "points": 0,
        "enabled": true,
        "acts_completed": [],
        "rewards": [],
        "password": hashed_password,
        "refresh_token": refresh_token,
        "email": email,
        "first_name": first_name,
        "last_name": last_name
    })

    await admin.save();
    await mongoose.disconnect();
}

insertIntoDatabase();