"use strict";

/***** Alter the index.js file in the 'api' folder before running these tests ****/

//The environment variables are not overwritten when loaded from different locations
//New variables are only added
require("dotenv").load({ path: __dirname + "/../.env_test" });
require("dotenv").load();
const homepage = "http://localhost:3000";
const registration_end_point = "/api/users/register";
const login_end_point = "/api/users/login";
const verification_end_point = "/api/verify/";
const fs = require("fs");
const secret = require("../secret");
const mongoose = require("mongoose");
const User = require("../models/User");
const Role = require("../models/Role");
const Act = require("../models/Act");
const File = require("../models/File");
const Tag = require("../models/Tag");
const Reward = require("../models/Reward");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const FormData = require("form-data");

function createJWT(user) {
  const payload = {
    id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    roles: user.roles
  };
  const user_token = jwt.sign(
    payload,
    process.env.SECRET_KEY,
    secret.signOptions
  );
  return user_token;
}

async function sendIncompleteValuesToEndPointWithFormData(
  type_of_incomplete_data,
  request_type,
  input_array,
  end_point,
  expected_status_code
) {
  const options = {
    method: request_type,
    uri: `${homepage}${end_point}`,
    json: true
  };
  const promises = [];
  for (let i = 0; i < input_array.length; i++) {
    let obj = {};
    for (let j = 0; j < input_array.length; j++) {
      if (type_of_incomplete_data == "incomplete") {
        if (j != i) obj[input_array[j][0]] = input_array[j][1];
      } else if (type_of_incomplete_data == "empty") {
        if (j != i) {
          obj[input_array[j][0]] = input_array[j][1];
        } else obj[input_array[j][0]] = "";
      }
    }
    //Send these incomplete values
    options.formData = obj;
    promises.push(
      request_promise(options)
        // .then(function (res) {
        //     console.info(res.points);
        // })
        .catch(function(err) {
          expect(err.statusCode).toBe(expected_status_code);
        })
    );
  }
  await Promise.all(promises);
}

async function sendIncompleteValuesToEndPointWithForm(
  type_of_incomplete_data,
  request_type,
  input_array,
  end_point,
  expected_status_code
) {
  const options = {
    method: request_type,
    uri: `${homepage}${end_point}`,
    json: true
  };
  const promises = [];
  for (let i = 0; i < input_array.length; i++) {
    let obj = {};
    for (let j = 0; j < input_array.length; j++) {
      if (type_of_incomplete_data == "incomplete") {
        if (j != i) obj[input_array[j][0]] = input_array[j][1];
      } else if (type_of_incomplete_data == "empty") {
        if (j != i) {
          obj[input_array[j][0]] = input_array[j][1];
        } else obj[input_array[j][0]] = "";
      }
    }
    //Send these incomplete values
    options.form = obj;
    promises.push(
      request_promise(options)
        // .then(function (res) {
        //     console.info(res.points);
        // })
        .catch(function(err) {
          expect(err.statusCode).toBe(expected_status_code);
        })
    );
  }
  await Promise.all(promises);
}

async function sendIncompleteValuesToEndPointWithFormAndAuthorization(
  type_of_incomplete_data,
  request_type,
  input_array,
  end_point,
  expected_status_code,
  jwt
) {
  const j = request_promise.jar();
  const cookie = request_promise.cookie("token=" + jwt);
  j.setCookie(cookie, `${homepage}${end_point}`);

  const options = {
    method: request_type,
    uri: `${homepage}${end_point}`,
    json: true,
    jar: j
  };
  const promises = [];
  for (let i = 0; i < input_array.length; i++) {
    let obj = {};
    for (let j = 0; j < input_array.length; j++) {
      if (type_of_incomplete_data == "incomplete") {
        if (j != i) obj[input_array[j][0]] = input_array[j][1];
      } else if (type_of_incomplete_data == "empty") {
        if (j != i) {
          obj[input_array[j][0]] = input_array[j][1];
        } else obj[input_array[j][0]] = "";
      }
    }
    //Send these incomplete values
    options.form = obj;
    promises.push(
      request_promise(options)
        // .then(function (res) {
        //     console.info(res.points);
        // })
        .catch(function(err) {
          expect(err.statusCode).toBe(expected_status_code);
        })
    );
  }
  await Promise.all(promises);
}

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe("ABC", () => {
  //Insert data into collections

  beforeAll(async () => {
    //Connect to Test Database
    mongoose.connect(process.env.DBURL, {
      useCreateIndex: true,
      useNewUrlParser: true,
      replicaSet: "rs"
    });

    //Remove data from all collections
    let my_promises = [];
    //Delete Users
    my_promises.push(User.deleteMany({}));
    //Delete Roles
    my_promises.push(Role.deleteMany({}));
    //Delete Acts
    my_promises.push(Act.deleteMany({}));
    //Delete Tags
    my_promises.push(Tag.deleteMany({}));
    //Delete File
    my_promises.push(File.deleteMany({}));
    //Delete Rewards
    my_promises.push(Reward.deleteMany({}));

    await Promise.all(my_promises);

    //Create roles
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

    my_promises = [
      act_poster.save(),
      reward_provider.save(),
      manager.save(),
      admin.save()
    ];
    await Promise.all(my_promises);

    //Create users with privileges
    //Create admin
    //Create manager
    //Create act poster
    //Create reward poster
    //Create normal user

    //Store their JWTs
  });

  it("Do this", function(done) {
    done();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
});
