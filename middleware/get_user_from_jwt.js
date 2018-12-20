// const jwt = require('jsonwebtoken');
// const secret = require('../secret');
// // const User = require('../models/User');

// function getCookie(cookiename, cookies) {
//     // Get name followed by anything except a semicolon
//     var cookiestring = RegExp("" + cookiename + "[^;]+").exec(cookies);
//     // Return everything after the equal sign, or an empty string if the cookie name not found
//     return decodeURIComponent(
//         !!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : ""
//     );
// }

// async function getUserFromJWT(context) {
//     const verifyOptions = Object.assign({}, secret.signOptions);
//     verifyOptions.algorithm = ["HS256"];

//     //Get token
//     const token = getCookie('token', context.req.headers.cookie);
//     //Get refresh token
//     const refresh_token = getCookie('refresh_token', context.req.headers.cookie);
//     let user;
//     try {
//         user = jwt.verify(token, process.env.SECRET_KEY, verifyOptions);
//     } catch (error) {
//         //If token is empty or invalid
//         //Use refresh token to figure out who this user is
//         if (refresh_token) {
//             user = await User.findOne({ refresh_token: refresh_token });
//             if (user) {
//                 //If user exists
//                 //Create new JWT and attach it to the cookie
//                 const payload = {
//                     id: user._id,
//                     first_name: user.first_name,
//                     last_name: user.last_name,
//                     roles: user.roles
//                 }
//                 const user_token = jwt.sign(payload, process.env.SECRET_KEY, secret.signOptions);
//                 //Insert this JWT into a cookie (Exists for one hour)
//                 //   res.cookie('token', user_token, { maxAge: 3600000 })
//                 context.req.headers.cookie += `; ${user_token}`;
//                 user = payload;
//             }
//         }
//     }
//     //Attach this user's details to the req object
//     if (user)
//         context.req.user = user;
// }

export default function (context) {
    // const x = getCookie("connect.sid", context.req.headers.cookie);
    // context.name = x;
    // getUserFromJWT(context);
}