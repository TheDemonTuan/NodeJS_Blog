const User = require('../models/users');
const message = require("../middlewares/message.js");

// [GET] /
exports.index = async (req, res, next) => {
  res.render("signup", { title: "Sign up" });
};

// [POST] /
exports.store = async (req, res, next) => {
  try {
    // Check duplicate email or username or display name
    var duplicateCheck = await User.findByEmailOrUsernameOrDisplayName(req.body.email, req.body.username, req.body.displayName)

    // If duplicate email or username or display name exists, return error
    if (duplicateCheck)
      return message.set(req, res, next, "error", "Email or username or display name already exists", true, '.');

    // Create new user
    var user = await User.create(new User(req.body, 'signUp'));
    //console.log(user);
    //await UserSetting.create({ userId: user.insertId });

    // If can't create new user, return error
    if (user.affectedRows === 0)
      throw new Error("Can't create new user");

    // Return success message
    message.set(req, res, next, "success", "Sign up successfully", true, `../signin`);
  } catch (err) {
    // Return error message
    message.set(req, res, next, "error", "Can't sign up new user, please try again later.", true, '.');
  }
};
