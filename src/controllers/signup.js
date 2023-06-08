const Users = require("../models/users.js");
const bcrypt = require("bcrypt");
const message = require("../middlewares/message.js");

// [GET] /
exports.index = async (req, res, next) => {
  res.render("signup", { title: "Sign up" });
};

// [POST] /
exports.store = async (req, res, next) => {
  try {
    // Check duplicate email or username
    var duplicateCheck = await new Promise((resolve, reject) => {
      Users.findByEmailOrUsername(req.body.email, req.body.username, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      }
      );
    });

    // If duplicate email or username exists, return error
    if (duplicateCheck.length > 0)
      return message.create(req, res, next, "error", "Email or username already exists", true);

    // Hash password
    req.body.password = await bcrypt.hashSync(req.body.password, 11);

    // Create new user
    await new Promise((resolve, reject) => {
      Users.create(new Users(req.body), (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    // Return success message
    return message.create(req, res, next, "success", "Sign up successfully", true, "/signin");
  } catch (err) {
    // Return error message
    //console.log(err);
    return message.create(req, res, next, "error", "Something went wrong", true);
  }
};
