const Promise = require('bluebird');
const User = Promise.promisifyAll(require('../models/users'));
const message = require("../middlewares/message.js");

// [GET] /
exports.index = async (req, res, next) => {
  res.locals.old_email = req.query.email ? req.query.email : false;
  res.locals.old_username = req.query.username ? req.query.username : false;
  res.render("signup", { title: "Sign up" });
};

// [POST] /
exports.store = async (req, res, next) => {
  try {
    // Check duplicate email or username
    var duplicateCheck = await User.findByEmailOrUsernameAsync(req.body.email, req.body.username)

    // If duplicate email or username exists, return error
    if (duplicateCheck.length > 0)
      return message.set(req, res, next, "error", "Email or username already exists", true,`/signup?email=${req.body.email}&username=${req.body.username}`);

    // Create new user
    var user = await User.createAsync(req.body)

    // If can't create new user, return error
    if(user.affectedRows === 0)
      throw new Error("Can't create new user");

    // Return success message
    return message.set(req, res, next, "success", "Sign up successfully", true, `/signin?username=${req.body.username}`);
  } catch (err) {
    // Return error message
    //console.log(err);
    return message.set(req, res, next, "error", "Can't sign up new user, please try again later.", true);
  }
};
