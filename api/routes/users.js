const { Router } = require('express')
const User = require('../../models/User');
var createError = require('http-errors');
const multer = require('multer');
const fs = require('fs');
var upload = multer({
  dest: 'tmp/'
});

const router = Router()

// Mock Users
const users = [
  { name: 'Alexandre' },
  { name: 'Pooya' },
  { name: 'Sébastien' }
]

/* GET users listing. */
router.get('/users', function (req, res, next) {
  res.json(users)
})

/* GET user by ID. */
router.get('/users/:id', function (req, res, next) {
  const id = parseInt(req.params.id)
  if (id >= 0 && id < users.length) {
    res.json(users[id])
  } else {
    res.sendStatus(404)
  }
})

// Register User
router.post('/register', upload.single('file'), async function (req, res, next) {
  try {
    //If the user is already logged in, give error
    if (req.user)
      throw new Error("You must not be logged in to access this endpoint");
    if (req.file)
      req.body.profile_picture = './tmp/' + req.file.filename
    let user = await User.initialize(req.body);
    await user.save();
    await user.sendVerificationEmail();
    await user.save();
    user = user.toObject();
    delete user.password;
    // res.redirect('/verify_account');
    res.json(user);
  } catch (err) {
    next(createError(400, err.message))
  }
  finally {
    //Delete uploaded file
    if (req.file)
      fs.unlinkSync(req.body.profile_picture);
  }
})

module.exports = router
