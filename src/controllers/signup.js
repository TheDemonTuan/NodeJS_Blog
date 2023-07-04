const message = require("../middlewares/message.js");
const User = require('../models/users');
const Group = require('../models/groups');

// [GET] /
exports.index = async (req, res, next) => {
  res.render("signup", { title: "Sign up" });
};

// [POST] /submit
exports.store = async (req, res, next) => {
  try {
    // Check duplicate email or username or display name
    const duplicateCheck = await User.findByEmailOrUsernameOrDisplayName(req.body.email, req.body.username, req.body.displayName)

    // If duplicate email or username or display name exists, return error
    if (duplicateCheck)
      return message.set(req, res, next, "error", "Email or username or display name already exists", true, '.');

    // Create new user
    const user = await Group.signUp(req.body);

    // If can't create new user, return error
    if (!user || !user[0].affectedRows || !user[1].affectedRows)
      throw new Error("Can't create new user");

    // Return success message
    message.set(req, res, next, "success", "Sign up successfully", true, `../signin`);
  } catch (err) {
    // Return error message
    next(err);
  }
};
