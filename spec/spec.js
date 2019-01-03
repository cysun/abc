'use strict'

require('dotenv').load();
const homepage = "http://localhost:3000"
const registration_end_point = "/api/users/register";
const login_end_point = "/api/users/login";
const verification_end_point = "/api/verify/";
let request_promise = require('request-promise');
// request_promise = request_promise.defaults({ jar: true });
const fs = require('fs');
const secret = require('../secret');
const mongoose = require('mongoose');
const User = require('../models/User');
const Act = require('../models/Act');
const Tag = require('../models/Tag');
const jwt = require('jsonwebtoken');

function createJWT(user) {
    const payload = {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        roles: user.roles
    }
    const user_token = jwt.sign(payload, process.env.SECRET_KEY, secret.signOptions);
    return user_token;
}

async function sendIncompleteValuesToEndPointWithFormData(type_of_incomplete_data, request_type, input_array, end_point, expected_status_code) {
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
                if (j != i)
                    obj[input_array[j][0]] = input_array[j][1];
            } else if (type_of_incomplete_data == "empty") {
                if (j != i) {
                    obj[input_array[j][0]] = input_array[j][1];
                } else
                    obj[input_array[j][0]] = "";
            }

        }
        //Send these incomplete values
        options.formData = obj
        promises.push(request_promise(options)
            // .then(function (res) {
            //     console.info(res.points);
            // })
            .catch(function (err) {
                expect(err.statusCode).toBe(expected_status_code)
            }));
    }
    await Promise.all(promises);
}

async function sendIncompleteValuesToEndPointWithForm(type_of_incomplete_data, request_type, input_array, end_point, expected_status_code) {
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
                if (j != i)
                    obj[input_array[j][0]] = input_array[j][1];
            } else if (type_of_incomplete_data == "empty") {
                if (j != i) {
                    obj[input_array[j][0]] = input_array[j][1];
                } else
                    obj[input_array[j][0]] = "";
            }

        }
        //Send these incomplete values
        options.form = obj
        promises.push(request_promise(options)
            // .then(function (res) {
            //     console.info(res.points);
            // })
            .catch(function (err) {
                expect(err.statusCode).toBe(expected_status_code)
            }));
    }
    await Promise.all(promises);
}

async function sendIncompleteValuesToEndPointWithFormAndAuthorization(type_of_incomplete_data, request_type, input_array, end_point, expected_status_code, jwt) {
    const j = request_promise.jar();
    const cookie = request_promise.cookie('token=' + jwt);
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
                if (j != i)
                    obj[input_array[j][0]] = input_array[j][1];
            } else if (type_of_incomplete_data == "empty") {
                if (j != i) {
                    obj[input_array[j][0]] = input_array[j][1];
                } else
                    obj[input_array[j][0]] = "";
            }

        }
        //Send these incomplete values
        options.form = obj
        promises.push(request_promise(options)
            // .then(function (res) {
            //     console.info(res.points);
            // })
            .catch(function (err) {
                expect(err.statusCode).toBe(expected_status_code)
            }));
    }
    await Promise.all(promises);
}

describe('ABC', () => {

    let first_user_id;
    let first_user;
    let second_user_id;
    let profile_picture;
    let user_jwt;
    let act_poster = {};
    let reward_poster = {};
    let manager = {};
    let admin = {};
    let user_refresh_token;
    let user;
    let uploaded_proof;
    let uploaded_proof1;
    let uploaded_proof2;
    let uploaded_proof3;

    beforeAll(async (done) => {
        mongoose.connect(process.env.DBURL, {
            useCreateIndex: true,
            useNewUrlParser: true
        });

        // jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

        //Create users with privileges
        const registration_form = {
            email: "act_poster@email.com",
            first_name: "first_name",
            last_name: "last_name",
            password: "password1!Q"
        }
        const options = {
            method: "POST",
            url: `${homepage}${registration_end_point}`,
            formData: registration_form,
            json: true
        }

        const promised_act_poster = request_promise(options)
            .then(function (res) {
                act_poster.id = res._id;
            })

        registration_form.email = "reward_poster@email.com";
        options.formData = registration_form;
        const promised_reward_poster = request_promise(options)
            .then(function (res) {
                reward_poster.id = res._id;
            })

        registration_form.email = "manager@email.com";
        options.formData = registration_form;
        const promised_manager = request_promise(options)
            .then(function (res) {
                manager.id = res._id;
            })

        const promised_admin = User.findOne({ email: "admin@email.com" }).lean();

        let promises = [promised_act_poster, promised_reward_poster, promised_manager, promised_admin];
        await Promise.all(promises)
            .then(function (values) {
                admin = values[3];
            })

        //Give them privileges
        //Enable and verify them
        //Act poster
        const promised_act_poster_change = User.findByIdAndUpdate(
            act_poster.id,
            {
                $push: { roles: { name: "Act Poster" } },
                enabled: true,
                email: "act_poster@email.com"
            },
            { new: true }
        ).lean();
        //Reward provider
        const promised_reward_provider_change = User.findByIdAndUpdate(
            reward_poster.id,
            {
                $push: { roles: { name: "Reward Provider" } },
                enabled: true,
                email: "reward_provider@email.com"
            },
            { new: true }
        ).lean();
        //Manager
        const promised_manager_change = User.findByIdAndUpdate(
            manager.id,
            {
                $push: { roles: { name: "Manager" } },
                enabled: true,
                email: "manager@email.com"
            },
            { new: true }
        ).lean();
        promises = [promised_act_poster_change, promised_reward_provider_change, promised_manager_change];
        await Promise.all(promises)
            .then(function (values) {
                act_poster = values[0];
                reward_poster = values[1];
                manager = values[2];
            })

        // console.info(act_poster);
        // console.info(reward_poster);
        // console.info(manager);

        act_poster.jwt = createJWT(act_poster);
        reward_poster.jwt = createJWT(reward_poster);
        manager.jwt = createJWT(manager);
        admin.jwt = createJWT(admin);

        done();
    });

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    });

    it('(Failure) Registration with incomplete details', async () => {
        const promises = [];
        //Register with incomplete fields
        const registration_array = [
            ["email", "email@email.com"],
            ["first_name", "first_name"],
            ["last_name", "last_name"],
            ["password", "password1!Q"]
        ];

        //Try to register with one empty field
        promises.push(sendIncompleteValuesToEndPointWithFormData('incomplete', 'POST', registration_array, '/api/users/register', 400));
        promises.push(sendIncompleteValuesToEndPointWithFormData('empty', 'POST', registration_array, '/api/users/register', 400));

        await Promise.all(promises);
    });

    it('(Failure) Registration with weak password', async () => {
        const registration_form = {
            email: "email@email.com",
            first_name: "first_name",
            last_name: "last_name",
            password: "password"
        }
        const options = {
            method: "POST",
            url: `${homepage}${registration_end_point}`,
            formData: registration_form,
            json: true
        }
        await request_promise(options)
            .catch(function (err) {
                expect(err.statusCode).toBe(400)
            })
    });

    it('(Failure) Registration with invalid image', async () => {
        const registration_form = {
            email: "email@email.com",
            first_name: "first_name",
            last_name: "last_name",
            password: "password1!Q",
            file: fs.createReadStream(secret.invalid_image)
        }
        const options = {
            method: "POST",
            url: `${homepage}${registration_end_point}`,
            formData: registration_form,
            json: true
        }
        await request_promise(options)
            .catch(function (err) {
                expect(err.statusCode).toBe(400)
            })
    });

    it('(Success) Registration with valid details', async () => {
        const registration_form = {
            email: "email@email.com",
            first_name: "first_name",
            last_name: "last_name",
            password: "password1!Q"
        }
        const options = {
            method: "POST",
            url: `${homepage}${registration_end_point}`,
            formData: registration_form,
            json: true
        }
        await request_promise(options)
            .then(function (res) {
                first_user = res;
                first_user_id = res._id;
                expect(res.points).toBe(0);
                expect(res.unverified_email).toBe(registration_form.email);
            })
    });

    it('(Success) Registration with valid details and valid image', async () => {
        const registration_form = {
            email: "email1@email.com",
            first_name: "first_name",
            last_name: "last_name",
            password: "password1!Q",
            file: fs.createReadStream(secret.valid_image)
        }
        const options = {
            method: "POST",
            url: `${homepage}${registration_end_point}`,
            formData: registration_form,
            json: true
        }
        await request_promise(options)
            .then(function (res) {
                second_user_id = res._id;
                profile_picture = res.profile_picture;
                expect(res.points).toBe(0);
                expect(res.unverified_email).toBe(registration_form.email);
                expect(res.profile_picture).toBeDefined();
            })
    });

    it('(Failure) Verify user with wrong token', async (done) => {
        const options = {
            method: "PUT",
            url: `${homepage}${verification_end_point}invalid_token`,
            json: true
        }
        request_promise(options)
            .catch(function (err) {
                expect(err.statusCode).toBe(400);
                done();
            })
    });

    it('(Failure) Verify user without token', async (done) => {
        const options = {
            method: "PUT",
            url: `${homepage}${verification_end_point}`,
            json: true
        }
        request_promise(options)
            .catch(function (err) {
                expect(err.statusCode).toBe(404);
                done();
            })
    });

    it('(Success) Verify user', async () => {
        user = await User.findById(first_user_id);
        const options = {
            method: "PUT",
            url: `${homepage}${verification_end_point}${user.email_verification_token}`,
            json: true
        }
        await request_promise(options)
            .then(function (res) {
                user_jwt = res.token;
                user_refresh_token = res.refresh_token;
                expect(res.token).toBeDefined();
                expect(res.refresh_token).toBeDefined();
            })
    });

    it('(Failure) Registration with already verified email', async (done) => {
        const registration_form = {
            email: "email@email.com",
            first_name: "first_name",
            last_name: "last_name",
            password: "password1!Q"
        }
        const options = {
            method: "POST",
            url: `${homepage}${registration_end_point}`,
            formData: registration_form,
            json: true
        }
        request_promise(options)
            .catch(function (err) {
                expect(err.statusCode).toBe(400);
                done();
            })
    });

    it('(Failure) Registering when already logged in', async (done) => {
        const registration_form = {
            email: "email2@email.com",
            first_name: "first_name",
            last_name: "last_name",
            password: "password1!Q"
        }
        const j = request_promise.jar();
        const cookie = request_promise.cookie('token=' + user_jwt);
        j.setCookie(cookie, `${homepage}${registration_end_point}`);

        const options = {
            method: "POST",
            url: `${homepage}${registration_end_point}`,
            formData: registration_form,
            json: true,
            jar: j
        }
        request_promise(options)
            .catch(function (err) {
                expect(err.statusCode).toBe(400);
                done();
            })
        request_promise.cookie('token=');
    });

    it('(Failure) Disabled user cannot log in', async (done) => {
        const login_form = {
            email: "email1@email.com",
            password: "password1!Q"
        }
        const options = {
            method: "POST",
            url: `${homepage}${login_end_point}`,
            form: login_form,
            json: true
        }
        request_promise(options)
            .catch(function (err) {
                expect(err.statusCode).toBe(400);
                done();
            })
    });

    it('(Failure) Invalid login credentials should fail', async (done) => {
        const login_form = {
            email: "email@email.com",
            password: "password"
        }
        const options = {
            method: "POST",
            url: `${homepage}${login_end_point}`,
            form: login_form,
            json: true
        }
        request_promise(options)
            .catch(function (err) {
                expect(err.statusCode).toBe(400);
                done();
            })
    });

    it('(Failure) Empty login credentials should fail', async () => {
        const promises = [];
        //Login with incomplete fields
        const login_array = [
            ["email", "email@email.com"],
            ["password", "password1!Q"]
        ];

        //Try to login with one empty field
        promises.push(sendIncompleteValuesToEndPointWithForm('incomplete', 'POST', login_array, '/api/users/login', 400));
        promises.push(sendIncompleteValuesToEndPointWithForm('empty', 'POST', login_array, '/api/users/login', 400));

        await Promise.all(promises);
    });

    it('(Success) Login with valid details', async (done) => {
        const login_form = {
            email: "email@email.com",
            password: "password1!Q"
        }
        const options = {
            method: "POST",
            url: `${homepage}${login_end_point}`,
            form: login_form,
            json: true
        }
        request_promise(options)
            .then(function (res) {
                // console.info(res);
                expect(res.token).toBeDefined();
                done();
            })
    });

    //Non act poster/admin cannot create act
    it('(Failure) Only admins and act posters can create acts', async () => {
        const promises = [];

        //User cannot create acts
        const first_user_clone = Object.assign({}, first_user);
        first_user_clone.id = first_user_clone._id;
        delete first_user_clone._id;
        const valid_act_creation_form = {
            name: "Some name",
            description: "Some description",
            reward_points: 10,
            act_provider: first_user_clone
        }

        let j = request_promise.jar();
        let cookie = request_promise.cookie('token=' + user_jwt);
        j.setCookie(cookie, `${homepage}/api/acts/act`);

        const options = {
            method: "POST",
            url: `${homepage}/api/acts/act`,
            form: valid_act_creation_form,
            json: true,
            jar: j
        }
        promises.push(request_promise(options)
            .catch(function (err) {
                expect(err.statusCode).toBe(400);
            }))

        //Managers cannot create acts
        const manager_clone = Object.assign({}, manager);
        manager_clone.id = manager_clone._id;
        delete manager_clone._id;
        valid_act_creation_form.act_provider = manager_clone;

        j = request_promise.jar();
        cookie = request_promise.cookie('token=' + manager.jwt);
        j.setCookie(cookie, `${homepage}/api/acts/act`);

        options.form = valid_act_creation_form;
        options.jar = j;

        promises.push(request_promise(options)
            .catch(function (err) {
                expect(err.statusCode).toBe(400);
            }))

        //Reward posters cannot create acts
        const reward_poster_clone = Object.assign({}, reward_poster);
        reward_poster_clone.id = reward_poster_clone._id;
        delete reward_poster_clone._id;
        valid_act_creation_form.act_provider = reward_poster_clone;

        j = request_promise.jar();
        cookie = request_promise.cookie('token=' + reward_poster.jwt);
        j.setCookie(cookie, `${homepage}/api/acts/act`);

        options.form = valid_act_creation_form;
        options.jar = j;

        promises.push(request_promise(options)
            .catch(function (err) {
                expect(err.statusCode).toBe(400);
            }))

        await Promise.all(promises);
    });

    //Non act poster cannot create event
    it('(Failure) Only admins and act posters can create events', async () => {
        const promises = [];

        //User cannot create acts
        const first_user_clone = Object.assign({}, first_user);
        first_user_clone.id = first_user_clone._id;
        delete first_user_clone._id;
        const valid_act_creation_form = {
            name: "Some name",
            description: "Some description",
            reward_points: 10,
            act_provider: first_user_clone,
            start_time: new Date('2019-01-02T00:00'),
            end_time: new Date('2019-01-18T10:55')
        }

        let j = request_promise.jar();
        let cookie = request_promise.cookie('token=' + user_jwt);
        j.setCookie(cookie, `${homepage}/api/acts/event`);

        const options = {
            method: "POST",
            url: `${homepage}/api/acts/event`,
            form: valid_act_creation_form,
            json: true,
            jar: j
        }

        promises.push(request_promise(options)
            .catch(function (err) {
                expect(err.statusCode).toBe(400);
            }))

        //Managers cannot create acts
        const manager_clone = Object.assign({}, manager);
        manager_clone.id = manager_clone._id;
        delete manager_clone._id;
        valid_act_creation_form.act_provider = manager_clone;
        options.form = valid_act_creation_form;

        j = request_promise.jar();
        cookie = request_promise.cookie('token=' + manager.jwt);
        j.setCookie(cookie, `${homepage}/api/acts/event`);

        options.jar = j;

        promises.push(request_promise(options)
            .catch(function (err) {
                expect(err.statusCode).toBe(400);
            }))

        //Reward posters cannot create acts
        const reward_poster_clone = Object.assign({}, reward_poster);
        reward_poster_clone.id = reward_poster_clone._id;
        delete reward_poster_clone._id;
        valid_act_creation_form.act_provider = reward_poster_clone;
        options.form = valid_act_creation_form;

        j = request_promise.jar();
        cookie = request_promise.cookie('token=' + reward_poster.jwt);
        j.setCookie(cookie, `${homepage}/api/acts/event`);

        options.jar = j;

        promises.push(request_promise(options)
            .catch(function (err) {
                expect(err.statusCode).toBe(400);
            }))

        await Promise.all(promises);
    });

    //Fail if incomplete values are used to create act by act poster and admin
    it('(Failure) Incomplete values cannot be used to create acts', async () => {


        const promises = [];
        //Register with incomplete fields
        const create_act_array = [
            ["name", "Some name"],
            ["descripion", "Some description"],
            ["reward_points", 10]
        ];

        //Try to create an act with one empty field as act poster
        promises.push(sendIncompleteValuesToEndPointWithFormAndAuthorization('incomplete', 'POST', create_act_array, '/api/acts/act', 400, act_poster.jwt));
        promises.push(sendIncompleteValuesToEndPointWithFormAndAuthorization('empty', 'POST', create_act_array, '/api/acts/act', 400, act_poster.jwt));
        //Try to create an act with one empty field as admin
        promises.push(sendIncompleteValuesToEndPointWithFormAndAuthorization('incomplete', 'POST', create_act_array, '/api/acts/act', 400, admin.jwt));
        promises.push(sendIncompleteValuesToEndPointWithFormAndAuthorization('empty', 'POST', create_act_array, '/api/acts/act', 400, admin.jwt));

        await Promise.all(promises);
    });

    //Fail if incomplete values are used to create event by act poster and admin
    it('(Failure) Incomplete values cannot be used to create events', async () => {


        const promises = [];
        //Create event with incomplete fields
        const create_act_array = [
            ["name", "Some name"],
            ["descripion", "Some description"],
            ["reward_points", 10],
            ["start_time"], new Date('2019-01-02T00:00'),
            ["end_time"], new Date('2019-01-18T10:55')
        ];

        //Try to create an event with one empty field as act poster
        promises.push(sendIncompleteValuesToEndPointWithFormAndAuthorization('incomplete', 'POST', create_act_array, '/api/acts/event', 400, act_poster.jwt));
        promises.push(sendIncompleteValuesToEndPointWithFormAndAuthorization('empty', 'POST', create_act_array, '/api/acts/event', 400, act_poster.jwt));
        //Try to create an event with one empty field as admin
        promises.push(sendIncompleteValuesToEndPointWithFormAndAuthorization('incomplete', 'POST', create_act_array, '/api/acts/event', 400, admin.jwt));
        promises.push(sendIncompleteValuesToEndPointWithFormAndAuthorization('empty', 'POST', create_act_array, '/api/acts/event', 400, admin.jwt));

        await Promise.all(promises);
    });

    //Fail if end time of event is before start time
    it('(Failure) End time of events must be after the start time', async () => {
        const promises = [];

        const invalid_event_creation_form = {
            name: "Some name",
            description: "Some description",
            reward_points: 10,
            start_time: new Date('2019-01-02T00:00'),
            end_time: new Date('2019-01-01T10:55')
        }

        let j = request_promise.jar();
        let cookie = request_promise.cookie('token=' + act_poster.jwt);
        j.setCookie(cookie, `${homepage}/api/acts/event`);

        const options = {
            method: "POST",
            url: `${homepage}/api/acts/event`,
            form: invalid_event_creation_form,
            json: true,
            jar: j
        }
        //Act poster request
        promises.push(request_promise(options)
            .catch(function (err) {
                expect(err.statusCode).toBe(400);
            }))

        j = request_promise.jar();
        cookie = request_promise.cookie('token=' + admin.jwt);
        j.setCookie(cookie, `${homepage}/api/acts/event`);

        //Admin request
        options.jar = j;
        promises.push(request_promise(options)
            .catch(function (err) {
                expect(err.statusCode).toBe(400);
            }))

        await Promise.all(promises);
    });

    //Succeed if act poster or admin posts act
    it('(Success) Succeed if correct details are sent by correct users', async () => {
        const promises = [];

        const act_creation_form = {
            name: "Some test name specifically for jasmine",
            description: "Some description",
            reward_points: 10
            // start_time: new Date('2019-01-02T00:00'),
            // end_time: new Date('2019-01-18T10:55')
        }

        let j = request_promise.jar();
        let cookie = request_promise.cookie('token=' + act_poster.jwt);
        j.setCookie(cookie, `${homepage}/api/acts/act`);

        const options = {
            method: "POST",
            url: `${homepage}/api/acts/act`,
            form: act_creation_form,
            json: true,
            jar: j
        }
        //Act poster request
        promises.push(request_promise(options)
            .then(function (res) {
                expect(res.message).toBe("Success");
            }))

        //Admin request

        j = request_promise.jar();
        cookie = request_promise.cookie('token=' + admin.jwt);
        j.setCookie(cookie, `${homepage}/api/acts/act`);

        options.jar = j;
        promises.push(request_promise(options)
            .then(function (res) {
                expect(res.message).toBe("Success");
            }))

        await Promise.all(promises);
    });

    //Succeed if act poster or admin posts event
    it('(Success) Succeed if correct details are sent by correct users to create event', async () => {
        const promises = [];

        const act_creation_form = {
            name: "Some test name specifically for jasmine",
            description: "Some description",
            reward_points: 10,
            start_time: new Date('2019-01-02T00:00'),
            end_time: new Date('2019-01-18T10:55')
        }

        let j = request_promise.jar();
        let cookie = request_promise.cookie('token=' + act_poster.jwt);
        j.setCookie(cookie, `${homepage}/api/acts/event`);

        const options = {
            method: "POST",
            url: `${homepage}/api/acts/event`,
            form: act_creation_form,
            json: true,
            jar: j
        }
        //Act poster request
        promises.push(request_promise(options)
            .then(function (res) {
                expect(res.message).toBe("Success");
            }))

        //Admin request

        j = request_promise.jar();
        cookie = request_promise.cookie('token=' + admin.jwt);
        j.setCookie(cookie, `${homepage}/api/acts/event`);

        options.jar = j;
        promises.push(request_promise(options)
            .then(function (res) {
                expect(res.message).toBe("Success");
            }))

        await Promise.all(promises);
    });

    //Succeed if act poster or admin posts act with tags
    it('(Success) Succeed if correct details are sent by correct users to create act with tags', async () => {
        const promises = [];

        const act_creation_form = {
            name: "Some test name specifically for jasmine",
            description: "Some description",
            reward_points: 10,
            tags: "should_not_exist_tag"
        }

        let j = request_promise.jar();
        let cookie = request_promise.cookie('token=' + act_poster.jwt);
        j.setCookie(cookie, `${homepage}/api/acts/act`);

        const options = {
            method: "POST",
            url: `${homepage}/api/acts/act`,
            form: act_creation_form,
            json: true,
            jar: j
        }
        //Act poster request
        promises.push(request_promise(options)
            .then(function (res) {
                expect(res.message).toBe("Success");
            }))

        //Admin request
        j = request_promise.jar();
        cookie = request_promise.cookie('token=' + admin.jwt);
        j.setCookie(cookie, `${homepage}/api/acts/act`);

        options.jar = j;
        promises.push(request_promise(options)
            .then(function (res) {
                expect(res.message).toBe("Success");
            }))

        await Promise.all(promises);
    });

    //Succeed if act poster or admin posts act with duplicate tags
    it('(Success) Succeed if correct details are sent by correct users to create act with duplicate tags', async () => {
        const promises = [];

        const act_creation_form = {
            name: "Some test name specifically for jasmine",
            description: "Some description",
            reward_points: 10,
            tags: "should_not_exist_tag should_not_exist_tag should_not_exist_tag"
        }

        let j = request_promise.jar();
        let cookie = request_promise.cookie('token=' + act_poster.jwt);
        j.setCookie(cookie, `${homepage}/api/acts/act`);

        const options = {
            method: "POST",
            url: `${homepage}/api/acts/act`,
            form: act_creation_form,
            json: true,
            jar: j
        }
        //Act poster request
        promises.push(request_promise(options)
            .then(function (res) {
                expect(res.message).toBe("Success");
            }))

        //Admin request
        j = request_promise.jar();
        cookie = request_promise.cookie('token=' + admin.jwt);
        j.setCookie(cookie, `${homepage}/api/acts/act`);

        options.jar = j;
        promises.push(request_promise(options)
            .then(function (res) {
                expect(res.message).toBe("Success");
            }))

        await Promise.all(promises);
    });

    //Succeed if act poster or admin posts event with tags
    it('(Success) Succeed if correct details are sent by correct users to create event with tags', async () => {
        const promises = [];

        const act_creation_form = {
            name: "Some test name specifically for jasmine",
            description: "Some description",
            reward_points: 10,
            start_time: new Date('2019-01-02T00:00'),
            end_time: new Date('2019-01-18T10:55'),
            tags: "should_not_exist_tag"
        }

        let j = request_promise.jar();
        let cookie = request_promise.cookie('token=' + act_poster.jwt);
        j.setCookie(cookie, `${homepage}/api/acts/event`);

        const options = {
            method: "POST",
            url: `${homepage}/api/acts/event`,
            form: act_creation_form,
            json: true,
            jar: j
        }
        //Act poster request
        promises.push(request_promise(options)
            .then(function (res) {
                expect(res.message).toBe("Success");
            }))

        //Admin request

        j = request_promise.jar();
        cookie = request_promise.cookie('token=' + admin.jwt);
        j.setCookie(cookie, `${homepage}/api/acts/event`);

        options.jar = j;
        promises.push(request_promise(options)
            .then(function (res) {
                expect(res.message).toBe("Success");
            }))

        await Promise.all(promises);
    });

    //Newly created tag should exist
    it('(Success) should_not_exist_tag (tag) should exist ', async () => {
        const tag = await Tag.findOne({ name: "should_not_exist_tag" })
        expect(tag).toBeTruthy
    });

    /******************************Read acts******************************/
    //Non logged in user can't see acts 
    it('(Failure) Only logged in users can see acts', async () => {
        const promises = [];

        const options = {
            method: "GET",
            url: `${homepage}/acts`,
            json: true
        }

        //(Empty token)
        promises.push(request_promise(options)
            .catch(function (err) {
                expect(err.statusCode).toBe(400);
            }))

        //(Invalid token)
        const j = request_promise.jar();
        const cookie = request_promise.cookie('token=invalid_token');
        j.setCookie(cookie, `${homepage}/acts`);

        promises.push(request_promise(options)
            .catch(function (err) {
                expect(err.statusCode).toBe(400);
            }))

        await Promise.all(promises);
    });

    //Search for specific available act
    it('(Failure) Certain acts should not show up in available acts', async () => {
        const promises = [];

        let j = request_promise.jar();
        let cookie = request_promise.cookie('token=' + user_jwt);
        j.setCookie(cookie, `${homepage}/api/acts?type=AVAILABLE&search=Some test name specifically for jasmine`);

        const options = {
            method: "GET",
            url: `${homepage}/api/acts?type=AVAILABLE&search=Some test name specifically for jasmine`,
            json: true,
            jar: j
        }

        //Disabled acts should not show up
        await request_promise(options)
            .then(function (res) {
                expect(res.count).toBe(0);
            })

        //Enable an act
        //Make act unavailable
        let act = await Act.findOneAndUpdate(
            { name: "Some test name specifically for jasmine" },
            {
                'enabled.state': true,
                state: "NOT_AVAILABLE"
            },
            { new: true }
        );
        //Unavailable acts should not show up
        await request_promise(options)
            .then(function (res) {
                expect(res.count).toBe(0);
            })

        //Make this act available
        act = await Act.findByIdAndUpdate(
            act._id,
            { state: "AVAILABLE" },
            { new: true }
        )
        //Upload a proof to this act
        j = request_promise.jar();
        cookie = request_promise.cookie('token=' + user_jwt);
        j.setCookie(cookie, `${homepage}/api/acts/${act._id}/complete`);

        options.method = "POST";
        options.url = `${homepage}/api/acts/${act._id}/complete`;
        options.jar = j;
        const file_to_upload_form = {
            files: [fs.createReadStream(secret.invalid_image)]
        }
        options.formData = file_to_upload_form;

        await request_promise(options)
            .then(function (res) {
                uploaded_proof = res[0].new_name;
            })

        //Acts Under review should not be displayed

        j = request_promise.jar();
        cookie = request_promise.cookie('token=' + user_jwt);
        j.setCookie(cookie, `${homepage}/api/acts?type=AVAILABLE&search=Some test name specifically for jasmine`);

        options.method = "GET";
        options.url = `${homepage}/api/acts?type=AVAILABLE&search=Some test name specifically for jasmine`;
        options.jar = j;
        delete options.formData;

        await request_promise(options)
            .then(function (res) {
                expect(res.count).toBe(0);
            })

        //Have the manager approve the proof
        j = request_promise.jar();
        cookie = request_promise.cookie('token=' + manager.jwt);
        j.setCookie(cookie, `${homepage}/api/acts/${act._id}/user/${user._id}/approve`);

        options.method = "PUT";
        options.url = `${homepage}/api/acts/${act._id}/user/${user._id}/approve`;
        options.jar = j;
        await request_promise(options)

        //Completed acts should not show up
        j = request_promise.jar();
        cookie = request_promise.cookie('token=' + user_jwt);
        j.setCookie(cookie, `${homepage}/api/acts?type=AVAILABLE&search=Some test name specifically for jasmine`);

        options.method = "GET";
        options.url = `${homepage}/api/acts?type=AVAILABLE&search=Some test name specifically for jasmine`;
        options.jar = j;
        await request_promise(options)
            .then(function (res) {
                expect(res.count).toBe(0);
            })

        //Deleted acts should not show up
        const new_act = await Act.findOneAndUpdate(
            {
                name: "Some test name specifically for jasmine",
                'enabled.state': false
            },
            {
                'enabled.state': true,
                deleted: true
            },
            { new: true }
        )

        await request_promise(options)
            .then(function (res) {
                expect(res.count).toBe(0);
            })
    });

    //Available, enabled, non deleted acts should show up
    it('(Success) Available, enabled, non deleted acts should show up in available acts', async () => {
        const act = await Act.findOneAndUpdate(
            {
                name: "Some test name specifically for jasmine",
                'enabled.state': true,
                deleted: true
            },
            { deleted: false },
            { new: true }
        )

        let j = request_promise.jar();
        let cookie = request_promise.cookie('token=' + user_jwt);
        j.setCookie(cookie, `${homepage}/api/acts?type=AVAILABLE&search=Some test name specifically for jasmine`);

        const options = {
            method: "GET",
            url: `${homepage}/api/acts?type=AVAILABLE&search=Some test name specifically for jasmine`,
            json: true,
            jar: j
        }

        await request_promise(options)
            .then(function (res) {
                expect(res.count).toBeGreaterThan(0);
            })
    });

    //Rejected acts should show up in available acts
    it('(Success) Rejected acts should show up in the available acts section', async () => {
        let j = request_promise.jar();
        let cookie = request_promise.cookie('token=' + user_jwt);
        j.setCookie(cookie, `${homepage}/api/acts?type=AVAILABLE&search=Some test name specifically for jasmine`);

        const options = {
            method: "GET",
            url: `${homepage}/api/acts?type=AVAILABLE&search=Some test name specifically for jasmine`,
            json: true,
            jar: j
        }

        let act;
        await request_promise(options)
            .then(function (res) {
                act = res.acts[0];
            })

        //Send proof to this act
        j = request_promise.jar();
        cookie = request_promise.cookie('token=' + user_jwt);
        j.setCookie(cookie, `${homepage}/api/acts/${act._id}/complete`);

        options.method = "POST";
        options.url = `${homepage}/api/acts/${act._id}/complete`;
        options.jar = j;
        const file_to_upload_form = {
            files: [fs.createReadStream(secret.invalid_image)]
        }
        options.formData = file_to_upload_form;

        await request_promise(options)
            .then(function (res) {
                uploaded_proof1 = res[0].new_name;
            })

        //Use manager to disprove proof
        j = request_promise.jar();
        cookie = request_promise.cookie('token=' + manager.jwt);
        j.setCookie(cookie, `${homepage}/api/acts/${act._id}/user/${user._id}/disapprove`);

        options.method = "PUT";
        options.url = `${homepage}/api/acts/${act._id}/user/${user._id}/disapprove`;
        options.jar = j;
        delete options.formData;
        await request_promise(options)

        //Act should show up in available acts
        j = request_promise.jar();
        cookie = request_promise.cookie('token=' + user_jwt);
        j.setCookie(cookie, `${homepage}/api/acts?type=AVAILABLE&search=Some test name specifically for jasmine`);

        options.method = "GET";
        options.url = `${homepage}/api/acts?type=AVAILABLE&search=Some test name specifically for jasmine`;
        options.jar = j;

        await request_promise(options)
            .then(function (res) {
                expect(res.count).toBeGreaterThan(0);
            })
    });


    //Search for act that's under review
    it('Certain acts should not show up in under review acts', async () => {
        const promises = [];

        let j = request_promise.jar();
        let cookie = request_promise.cookie('token=' + user_jwt);
        j.setCookie(cookie, `${homepage}/api/acts?type=UNDER_REVIEW&search=Some test name specifically for jasmine`);

        const options = {
            method: "GET",
            url: `${homepage}/api/acts?type=UNDER_REVIEW&search=Some test name specifically for jasmine`,
            json: true,
            jar: j
        }

        //The last act made an act Completed
        //Available acts should not show up (The last test made an act available and enabled)
        //Also, if user has no acts under review, return nothing
        await request_promise(options)
            .then(function (res) {
                expect(res.count).toBe(0);
            })

        //Get rejected act
        j = request_promise.jar();
        cookie = request_promise.cookie('token=' + user_jwt);
        j.setCookie(cookie, `${homepage}/api/acts?type=AVAILABLE&search=Some test name specifically for jasmine`);

        options.url = `${homepage}/api/acts?type=AVAILABLE&search=Some test name specifically for jasmine`;
        options.jar = j;

        let act;
        await request_promise(options)
            .then(function (res) {
                act = res.acts[0];
            })

        //Upload a proof to this act thereby making it under review
        j = request_promise.jar();
        cookie = request_promise.cookie('token=' + user_jwt);
        j.setCookie(cookie, `${homepage}/api/acts/${act._id}/complete`);

        options.method = "POST";
        options.url = `${homepage}/api/acts/${act._id}/complete`;
        options.jar = j;
        const file_to_upload_form = {
            files: [fs.createReadStream(secret.invalid_image)]
        }
        options.formData = file_to_upload_form;

        await request_promise(options)
            .then(function (res) {
                uploaded_proof2 = res[0].new_name;
            })

        //Acts under review should be displayed
        j = request_promise.jar();
        cookie = request_promise.cookie('token=' + user_jwt);
        j.setCookie(cookie, `${homepage}/api/acts?type=UNDER_REVIEW&search=Some test name specifically for jasmine`);

        options.method = "GET";
        options.url = `${homepage}/api/acts?type=UNDER_REVIEW&search=Some test name specifically for jasmine`;
        options.jar = j;
        delete options.formData;

        await request_promise(options)
            .then(function (res) {
                expect(res.count).toBeGreaterThan(0);
            })

        //Make act unavailable
        act = await Act.findByIdAndUpdate(
            act._id,
            {
                state: "NOT_AVAILABLE"
            },
            { new: true }
        );

        //Unavailable acts should not show up
        await request_promise(options)
            .then(function (res) {
                expect(res.count).toBe(0);
            })

        //Make this act disabled
        act = await Act.findByIdAndUpdate(
            act._id,
            {
                'enabled.state': false,
                state: "AVAILABLE"
            },
            { new: true }
        );
        //Disabled acts should not show up
        await request_promise(options)
            .then(function (res) {
                expect(res.count).toBe(0);
            })

        //Delete act
        act = await Act.findByIdAndUpdate(
            act._id,
            {
                'enabled.state': true,
                deleted: true
            },
            { new: true }
        );
        //Deleted acts should not show up
        await request_promise(options)
            .then(function (res) {
                expect(res.count).toBe(0);
            })

        //Undelete the act
        act = await Act.findByIdAndUpdate(
            act._id,
            {
                deleted: false
            },
            { new: true }
        );

        //Reject the act
        j = request_promise.jar();
        cookie = request_promise.cookie('token=' + manager.jwt);
        j.setCookie(cookie, `${homepage}/api/acts/${act._id}/user/${user._id}/disapprove`);

        options.method = "PUT";
        options.url = `${homepage}/api/acts/${act._id}/user/${user._id}/disapprove`;
        options.jar = j;
        await request_promise(options)

        //Rejected acts should not show up
        j = request_promise.jar();
        cookie = request_promise.cookie('token=' + user_jwt);
        j.setCookie(cookie, `${homepage}/api/acts?type=UNDER_REVIEW&search=Some test name specifically for jasmine`);

        options.method = "GET";
        options.url = `${homepage}/api/acts?type=UNDER_REVIEW&search=Some test name specifically for jasmine`;
        options.jar = j;

        await request_promise(options)
            .then(function (res) {
                expect(res.count).toBe(0);
            })
    });

    //Search for rejected act
    it('Certain acts should not show up in Rejected acts', async () => {
        const promises = [];

        let j = request_promise.jar();
        let cookie = request_promise.cookie('token=' + user_jwt);
        j.setCookie(cookie, `${homepage}/api/acts?type=REJECTED&search=Some test name specifically for jasmine`);

        const options = {
            method: "GET",
            url: `${homepage}/api/acts?type=REJECTED&search=Some test name specifically for jasmine`,
            json: true,
            jar: j
        }

        //The last test rejected an act
        //Rejected acts should return something
        await request_promise(options)
            .then(function (res) {
                expect(res.count).toBeGreaterThan(0);
            })

        //Rejected acts are also available acts
        j = request_promise.jar();
        cookie = request_promise.cookie('token=' + user_jwt);
        j.setCookie(cookie, `${homepage}/api/acts?type=AVAILABLE&search=Some test name specifically for jasmine`);

        options.url = `${homepage}/api/acts?type=AVAILABLE&search=Some test name specifically for jasmine`;
        options.jar = j;

        let act;
        await request_promise(options)
            .then(function (res) {
                act = res.acts[0];
                expect(res.count).toBeGreaterThan(0);
            })        

        //Make act unavailable
        act = await Act.findByIdAndUpdate(
            act._id,
            {
                state: "NOT_AVAILABLE"
            },
            { new: true }
        );

        j = request_promise.jar();
        cookie = request_promise.cookie('token=' + user_jwt);
        j.setCookie(cookie, `${homepage}/api/acts?type=REJECTED&search=Some test name specifically for jasmine`);

        options.url = `${homepage}/api/acts?type=REJECTED&search=Some test name specifically for jasmine`;
        options.jar = j;

        //Unavailable acts should not show up
        //Completed acts should not show up (The last test created a completed act)
        await request_promise(options)
            .then(function (res) {
                expect(res.count).toBe(0);
            })

        //Make this act disabled
        act = await Act.findByIdAndUpdate(
            act._id,
            {
                'enabled.state': false,
                state: "AVAILABLE"
            },
            { new: true }
        );
        //Disabled acts should not show up
        await request_promise(options)
            .then(function (res) {
                expect(res.count).toBe(0);
            })

        //Delete act
        act = await Act.findByIdAndUpdate(
            act._id,
            {
                'enabled.state': true,
                deleted: true
            },
            { new: true }
        );
        //Deleted acts should not show up
        await request_promise(options)
            .then(function (res) {
                expect(res.count).toBe(0);
            })

        //Undelete the act
        act = await Act.findByIdAndUpdate(
            act._id,
            {
                deleted: false
            },
            { new: true }
        );

        //Upload a proof to this act thereby making it under review
        j = request_promise.jar();
        cookie = request_promise.cookie('token=' + user_jwt);
        j.setCookie(cookie, `${homepage}/api/acts/${act._id}/complete`);

        options.method = "POST";
        options.url = `${homepage}/api/acts/${act._id}/complete`;
        options.jar = j;
        const file_to_upload_form = {
            files: [fs.createReadStream(secret.invalid_image)]
        }
        options.formData = file_to_upload_form;

        await request_promise(options)
            .then(function (res) {
                uploaded_proof3 = res[0].new_name;
            })

        //Acts under review should not be displayed
        j = request_promise.jar();
        cookie = request_promise.cookie('token=' + user_jwt);
        j.setCookie(cookie, `${homepage}/api/acts?type=REJECTED&search=Some test name specifically for jasmine`);

        options.method = "GET";
        options.url = `${homepage}/api/acts?type=REJECTED&search=Some test name specifically for jasmine`;
        options.jar = j;
        delete options.formData;

        await request_promise(options)
            .then(function (res) {
                expect(res.count).toBe(0);
            })
    });


    //Search for completed act
    //Said act should not be:
    //Available
    //Under review
    //Rejected
    //Said act could be:
    //Disabled
    //Unavailable
    //Deleted
    //Search for My Acts
    //Said act should not be deleted
    //Said act could be:
    //Disabled
    //Unavailable

    afterAll(async () => {
        const promises = [];
        //Delete users
        promises.push(User.findByIdAndDelete(first_user_id));
        promises.push(User.findByIdAndDelete(second_user_id));
        promises.push(User.findByIdAndDelete(act_poster._id));
        promises.push(User.findByIdAndDelete(reward_poster._id));
        promises.push(User.findByIdAndDelete(manager._id));
        //Delete data
        promises.push(Act.deleteMany({ name: "Some test name specifically for jasmine" }));
        promises.push(Tag.deleteOne({ name: "should_not_exist_tag" }));

        await Promise.all(promises);

        await mongoose.disconnect();

        //Delete profile picture
        const image = process.env.profile_picture_folder + profile_picture.replace(process.env.website + process.env.display_picture_folder, '');
        fs.unlinkSync(image);
        //Delete uploaded proof
        const proof = process.env.act_picture_folder + uploaded_proof.replace(process.env.website + process.env.display_act_picture_folder, '');
        fs.unlinkSync(proof);
        const proof1 = process.env.act_picture_folder + uploaded_proof1.replace(process.env.website + process.env.display_act_picture_folder, '');
        fs.unlinkSync(proof1);
        const proof2 = process.env.act_picture_folder + uploaded_proof2.replace(process.env.website + process.env.display_act_picture_folder, '');
        fs.unlinkSync(proof2);
        const proof3 = process.env.act_picture_folder + uploaded_proof3.replace(process.env.website + process.env.display_act_picture_folder, '');
        fs.unlinkSync(proof3);
    });
});