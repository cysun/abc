//Uncomment the line below when running tests
// require("dotenv").load({ path: __dirname + "/../.env_test" });
//Comment the line above during development
require("dotenv").load();

const secret = require("../secret");
const User = require("../models/User");
const express = require("express");
const mongoose = require("mongoose");
var createError = require("http-errors");
var cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const CronJob = require("cron").CronJob;
var hbs = require("hbs");
var i18n = require("i18n");
i18n.configure({
  locales: ["en", "es"],
  directory: __dirname + "/locales"
});

// Create express instance
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(i18n.init);

hbs.registerHelper("__", function() {
  return i18n.__.apply(this, arguments);
});
hbs.registerHelper("__n", function() {
  return i18n.__n.apply(this, arguments);
});

const logger = require("../logger").winston;
const requestLogger = require("../logger").morgan;

const daily_email_to_managers_if_proofs_exist = require("../cron_jobs/daily_email_to_managers_if_proofs_exist");
const daily_email_to_reward_provider_if_rewards_are_requested_or_claimed = require("../cron_jobs/daily_email_to_reward_provider_if_rewards_are_requested_or_claimed");
const make_acts_unavailable_if_expiration_date_is_today = require("../cron_jobs/make_acts_unavailable_if_expiration_date_is_today");
const remind_act_poster_of_expiration = require("../cron_jobs/remind_act_poster_of_expiration");

logger.info("Before job instantiation");

//Every day at midnight
//"0 0 0 * * *"
const job1 = new CronJob("0 0 0 * * *", async function() {
  await daily_email_to_managers_if_proofs_exist.run();
  logger.info("Daily email to managers if proof exists have been sent");
});

const job2 = new CronJob("0 0 0 * * *", async function() {
  await daily_email_to_reward_provider_if_rewards_are_requested_or_claimed.run();
  logger.info(
    "Daily email to reward providers if rewards are requested or claimed have been sent"
  );
});

const job3 = new CronJob("0 0 0 * * *", async function() {
  await make_acts_unavailable_if_expiration_date_is_today.run();
  logger.info("Acts that should expire today have been made unavailable");
});

const job4 = new CronJob("0 0 0 * * *", async function() {
  await remind_act_poster_of_expiration.run();
  logger.info(
    "Act posters with acts which will expire in a week's time have been reminded via email"
  );
});

logger.info("After job instantiation");

job1.start();
job2.start();
job3.start();
job4.start();

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
      if (user && user.enabled) {
        //If user exists and is enabled
        //Create new JWT and attach it to the cookie
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
        //Insert this JWT into a cookie (Exists for one hour)
        res.cookie("token", user_token, { maxAge: 3600000 });
        user = payload;
      } else user = null;
    }
  }
  //Attach this user's details to the req object
  if (user && user.id) req.user = user;
  next();
}

async function getRoles(req, res, next) {
  //Check if the user object exists in request object
  //If so
  if (req.user) {
    //Check roles
    if (req.user.roles.length > 0) {
      req.roles = {};
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

//Logout user
function logoutUser(req, res, next) {
  if (!req.user) {
    res.status(401);
    res.json({ message: "You must be loggged in to access this endpoint" });
  } else next();
}

// Require API routes
const usersRouter = require("./routes/users");
const actsRouter = require("./routes/acts");
const baseRouter = require("./routes/base");
const rewardsRouter = require("./routes/rewards");
const adminRouter = require("./routes/admin");

mongoose.connection.on(
  "connected",
  () => logger.info(`Mongoose connected to ${process.env.DBURL}`)
  // console.log(`Mongoose connected to ${process.env.DBURL}`)
);
mongoose.connection.on("disconnected", () =>
  // console.log('Mongoose disconnected.')
  logger.info("Mongoose disconnected")
);
mongoose.connect(
  // process.env.DBURL,
  process.env.DBURL,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    replicaSet: "rs"
  }
);

// Import API Routes
app.use(requestLogger);
app.use(getUserFromJWT);
app.use(getRoles);
app.use("/", baseRouter);
app.use(logoutUser);
app.use("/acts", actsRouter);
app.use("/users", usersRouter);
app.use("/admin", adminRouter);
app.use("/rewards", rewardsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  if (err.status == 404) res.json({ message: "API endpoint not found" });
  else {
    res.json({ message: err.message });
  }

  if (req.user) {
    logger.error(`Exception caused by ${req.user.id}`);
  }
  logger.error(err);
});

async function shutdown(signal, callback) {
  console.log(`${signal} received.`);
  await mongoose.disconnect();
  if (typeof callback === "function") callback();
  else process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.once("SIGUSR2", signal => {
  shutdown(signal, () => process.kill(process.pid, "SIGUSR2"));
});

//// Uncomment this to debug
// app.listen(3000);
//// Run the below code
// nodemon --inspect ./api/index.js

// Export the server middleware
module.exports = {
  path: "/api",
  handler: app
};
