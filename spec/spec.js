'use strict'

require('dotenv').load();
const homepage = "http://localhost:3000"
const registration_end_point = "/api/users/register";
const verification_end_point = "/api/verify/";
let request_promise = require('request-promise');
request_promise = request_promise.defaults({ jar: true });
const fs = require('fs');
const secret = require('../secret');
const mongoose = require('mongoose');
const User = require('../models/User');

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
        options.formData = obj
        promises.push(request_promise(options)
            // .then(function (res) {
            //     console.info(res.points);
            // })
            .catch(function (err) {
                // console.info(err.error.message)
                // console.info(err.statusCode);
                expect(err.statusCode).toBe(expected_status_code)
            }));
    }
    await Promise.all(promises);
}

describe('ABC', () => {

    let first_user_id;
    let second_user_id;
    let profile_picture;
    let user_jwt;
    let user_refresh_token;

    beforeAll(async (done) => {
        mongoose.connect(process.env.DBURL, {
            useCreateIndex: true,
            useNewUrlParser: true
        });

        done();
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
        promises.push(sendIncompleteValuesToEndPointWithForm('incomplete', 'POST', registration_array, '/api/users/register', 400));
        promises.push(sendIncompleteValuesToEndPointWithForm('empty', 'POST', registration_array, '/api/users/register', 400));

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

    it('(Failure) Verify user with wrong token', async () => {
        const options = {
            method: "PUT",
            url: `${homepage}${verification_end_point}invalid_token`,
            json: true
        }
        await request_promise(options)
            .catch(function (err) {
                expect(err.statusCode).toBe(400);
            })
    });

    it('(Failure) Verify user without token', async () => {
        const options = {
            method: "PUT",
            url: `${homepage}${verification_end_point}`,
            json: true
        }
        await request_promise(options)
            .catch(function (err) {
                expect(err.statusCode).toBe(404);
            })
    });

    it('(Success) Verify user', async () => {
        const user = await User.findById(first_user_id);
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

    it('(Failure) Registration with already verified email', async () => {
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
            .catch(function (err) {
                expect(err.statusCode).toBe(400);
            })
    });

    it('(Failure) Registering when already logged in', async () => {
        const registration_form = {
            email: "email2@email.com",
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
        request_promise.cookie('token=' + user_jwt);
        await request_promise(options)
            .auth(null, null, true, user_jwt)
            .catch(function (err) {
                expect(err.statusCode).toBe(400);
            })
        request_promise.cookie('token=');
    });

    afterAll(async () => {
        //Delete users
        const promises = [];
        promises.push(User.findByIdAndDelete(first_user_id));
        promises.push(User.findByIdAndDelete(second_user_id));

        //Delete profile picture
        const image = process.env.profile_picture_folder + profile_picture.replace(process.env.website + process.env.display_picture_folder, '');
        fs.unlinkSync(image);

        await Promise.all(promises);

        await mongoose.disconnect();
    });
});