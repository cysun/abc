const { Router } = require('express')
const User = require('../../models/User');
var createError = require('http-errors');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const secret = require('../../secret');
var upload = multer({
  dest: 'tmp/'
});
const util = require("util");
const fs_delete_file = util.promisify(fs.unlink);
const sanitize = require("sanitize-html");
sanitize.defaults.allowedAttributes = [];
sanitize.defaults.allowedTags = [];

const router = Router()

//Verify this user
router.put('/verify/:verification_token', async function (req, res, next) {
  try {
    const token = sanitize(req.params.verification_token);
    //Get the user with this verification token
    const user = await User.findOne({ email_verification_token: token });
    //If exists
    if (user) {
      //Verify his email address
      user.email = user.unverified_email;
      user.unverified_email = undefined;
      //Delete his verification token
      user.email_verification_token = undefined;
      //Enable the user
      user.enabled = true;
      //Create a JWT
      const payload = {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        roles: user.roles
      }
      const user_token = jwt.sign(payload, process.env.SECRET_KEY, secret.signOptions);
      //Insert this JWT into a cookie (Exists for one hour)
      res.cookie('token', user_token, { maxAge: 3600000 })
      //Insert the refresh token as well (Exists for a year)
      res.cookie('refresh_token', user.refresh_token, {
        maxAge: 31536000000
      })
      await user.save();
      //Delete all users whose unverified email is this user's email
      //Unlink their profile pictures first if exists
      const about_to_be_deleted_users = await User.find({ unverified_email: user.email })
      const promises = [];
      about_to_be_deleted_users.forEach(user => {
        if (user.profile_picture) {
          const image = process.env.profile_picture_folder + user.profile_picture.replace(process.env.website + process.env.display_picture_folder, '');
          promises.push(fs_delete_file(image));
          // fs.unlink(image);
        }
      });
      if (promises.length > 0)
        await Promise.all(promises);
      await User.deleteMany({ unverified_email: user.email })
      res.json({
        token: user_token,
        refresh_token: user.refresh_token
      });
      res.end();
      return;
    }
    else {
      throw new Error("Invalid token");
    }
  } catch (err) {
    next(createError(400, err.message))
  }
});

module.exports = router
