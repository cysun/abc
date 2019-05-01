"use strict";

/***** Alter the nuxt.config file before running these tests ****/

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
const Subscriber = require("../models/Subscriber");
const Tag = require("../models/Tag");
const Reward = require("../models/Reward");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const FormData = require("form-data");
const querystring = require("querystring");

let admin_jwt, act_poster_jwt, manager_jwt, reward_provider_jwt, user_jwt;

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
    //Delete subscribers
    my_promises.push(Subscriber.deleteMany({}));

    await Promise.all(my_promises);

    //Create roles
    let act_poster = new Role({
      name: "Act Poster"
    });

    let reward_provider = new Role({
      name: "Reward Provider"
    });

    let manager = new Role({
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
    let password = "password";
    let email = "admin@email.com";
    let first_name = "admin_first_name";
    let last_name = "admin_last_name";

    let promised_refresh_token = User.getUniqueName("refresh_token", 100);
    let promised_hashed_password = bcrypt.hash(password, 12);

    let promises = [promised_refresh_token, promised_hashed_password];

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

    //Create manager
    password = "password";
    email = "manager@email.com";
    first_name = "manager_first_name";
    last_name = "manager_last_name";

    promised_refresh_token = User.getUniqueName("refresh_token", 100);
    promised_hashed_password = bcrypt.hash(password, 12);

    promises = [promised_refresh_token, promised_hashed_password];

    refresh_token;
    hashed_password;

    await Promise.all(promises).then(function(values) {
      refresh_token = values[0];
      hashed_password = values[1];
    });

    manager = new User({
      creation_date: new Date(),
      reset_tokens: [],
      roles: [
        {
          name: "Manager"
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

    //Create act poster
    password = "password";
    email = "act_poster@email.com";
    first_name = "act_poster_first_name";
    last_name = "act_poster_last_name";

    promised_refresh_token = User.getUniqueName("refresh_token", 100);
    promised_hashed_password = bcrypt.hash(password, 12);

    promises = [promised_refresh_token, promised_hashed_password];

    refresh_token;
    hashed_password;

    await Promise.all(promises).then(function(values) {
      refresh_token = values[0];
      hashed_password = values[1];
    });

    act_poster = new User({
      creation_date: new Date(),
      reset_tokens: [],
      roles: [
        {
          name: "Act Poster"
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

    //Create reward poster
    password = "password";
    email = "reward_poster@email.com";
    first_name = "reward_poster_first_name";
    last_name = "reward_poster_last_name";

    promised_refresh_token = User.getUniqueName("refresh_token", 100);
    promised_hashed_password = bcrypt.hash(password, 12);

    promises = [promised_refresh_token, promised_hashed_password];

    refresh_token;
    hashed_password;

    await Promise.all(promises).then(function(values) {
      refresh_token = values[0];
      hashed_password = values[1];
    });

    reward_provider = new User({
      creation_date: new Date(),
      reset_tokens: [],
      roles: [
        {
          name: "Reward Provider"
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

    //Create normal user
    password = "password";
    email = "user@email.com";
    first_name = "user_first_name";
    last_name = "user_last_name";

    promised_refresh_token = User.getUniqueName("refresh_token", 100);
    promised_hashed_password = bcrypt.hash(password, 12);

    promises = [promised_refresh_token, promised_hashed_password];

    refresh_token;
    hashed_password;

    await Promise.all(promises).then(function(values) {
      refresh_token = values[0];
      hashed_password = values[1];
    });

    let user = new User({
      creation_date: new Date(),
      reset_tokens: [],
      roles: [],
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

    promises = [
      admin.save(),
      manager.save(),
      act_poster.save(),
      reward_provider.save(),
      user.save()
    ];
    await Promise.all(promises).then(function(values) {
      admin = values[0];
      manager = values[1];
      act_poster = values[2];
      reward_provider = values[3];
      user = values[4];
    });

    //Store their JWTs
    let params = {
      email: admin.email,
      password: password
    };

    let promised_admin = axios
      .post(`${homepage}/api/login`, querystring.stringify(params))
      .then(function(res) {
        admin_jwt = res.data.token;
      })
      .catch(function(err) {
        // console.info(err.response.data);
      });

    params = {
      email: manager.email,
      password: password
    };
    let promised_manager = axios
      .post(`${homepage}/api/login`, querystring.stringify(params))
      .then(function(res) {
        manager_jwt = res.data.token;
      })
      .catch(function(err) {});

    params = {
      email: act_poster.email,
      password: password
    };
    let promised_act_poster = axios
      .post(`${homepage}/api/login`, querystring.stringify(params))
      .then(function(res) {
        act_poster_jwt = res.data.token;
      })
      .catch(function(err) {});

    params = {
      email: reward_provider.email,
      password: password
    };
    let promised_reward_provider = axios
      .post(`${homepage}/api/login`, querystring.stringify(params))
      .then(function(res) {
        reward_provider_jwt = res.data.token;
      })
      .catch(function(err) {});

    params = {
      email: user.email,
      password: password
    };
    let promised_user = axios
      .post(`${homepage}/api/login`, querystring.stringify(params))
      .then(function(res) {
        user_jwt = res.data.token;
      })
      .catch(function(err) {});

    promises = [
      promised_act_poster,
      promised_admin,
      promised_manager,
      promised_reward_provider,
      promised_user
    ];
    await Promise.all(promises);

    // console.info(admin_jwt);
  });

  it("(Failure) Sign up with ", function(done) {
    done();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
});
