require('dotenv').load();
const globals = require('../globals');
const secret = require('../secret');
const User = require('../models/User');
const express = require('express')
const mongoose = require('mongoose');
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

// Create express instnace
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

async function getUserFromJWT(req, res, next) {
  const verifyOptions = Object.assign({}, secret.signOptions);
  verifyOptions.algorithm = ["HS256"];

  //Get token
  const token = req.cookies.token;
  //Get refresh token
  const refresh_token = req.cookies.refresh_token;
  let user;
  try {
    user = jwt.verify(token, process.env.SECRET_KEY, verifyOptions);
  } catch (error) {
    //If token is empty or invalid
    //Use refresh token to figure out who this user is
    if (refresh_token) {
      user = await User.findOne({ refresh_token: refresh_token });
      if (user) {
        //If user exists
        //Create new JWT and attach it to the cookie
        const payload = {
          id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          roles: user.roles
        }
        const user_token = jwt.sign(payload, process.env.SECRET_KEY, secret.signOptions);
        //Insert this JWT into a cookie (Exists for one hour)
        res.cookie('token', user_token, { maxAge: 3600000 })
        user = payload;
      }
    }
  }
  //Attach this user's details to the req object
  if (user)
    req.user = user;
  next();
}

async function getRoles(req, res, next) {
  //Check if the user object exists in request object
  //If so
  if (req.user) {
    //Check roles
    if (req.user.roles.length > 0) {
      req.roles = {}
      req.user.roles.forEach(element => {
        //Attach roles in array into distinct properties
        switch (element.name) {
          case "Act Poster":
            req.roles.act_poster = true;
            break;
          case "Reward Provider":
            req.roles.reward_provider = true;
            break;
          case "Manager":
            req.roles.manager = true;
            break;
          case "Administrator":
            req.roles.reward_provider = true;
            req.roles.administrator = true;
            req.roles.act_poster = true;
            req.roles.manager = true;
            break;
        }
      });
      res.locals.roles = req.roles;
    }
  }
  next();
}
// Require API routes
const usersRouter = require('./routes/users')
const actsRouter = require('./routes/acts')
const baseRouter = require('./routes/base')

mongoose.connection.on('connected', () =>
  console.log(`Mongoose connected to ${process.env.DBURL}`)
);
mongoose.connection.on('disconnected', () =>
  console.log('Mongoose disconnected.')
);
mongoose.connect(process.env.DBURL, {
  useCreateIndex: true,
  useNewUrlParser: true
});

// Import API Routes
app.use(getUserFromJWT);
app.use(getRoles);
app.use('/', baseRouter);
app.use('/acts', actsRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  if (err.status == 404)
    res.json({ message: "API endpoint not found" });
  else {
    res.json({ message: err.message });
    //Redirect to the calling page with the error message in the url
    // req.flash('body', req.body);
    // res.redirect(url.parse(req.headers.referer).pathname + '?error=' + err.message);
  }
});

async function shutdown(signal, callback) {
  console.log(`${signal} received.`);
  await mongoose.disconnect();
  if (typeof callback === 'function') callback();
  else process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.once('SIGUSR2', signal => {
  shutdown(signal, () => process.kill(process.pid, 'SIGUSR2'));
});

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app
}
