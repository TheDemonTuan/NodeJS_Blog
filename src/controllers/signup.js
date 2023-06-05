const Users = require("../models/users.js");
const bcrypt = require("bcrypt");

// [GET] /
exports.index = async (req, res, next) => {
  res.render("signup", { title: "Sign up", csrfToken: req.csrfToken() });
};

// [POST] /
exports.store = async (req, res, next) => {
  try {
    // Check duplicate email or username
    //Demo//
    var duplicateCheck = await new Promise((resolve, reject) => {
      Users.findByEmailOrUsername(
        req.body.email,
        req.body.username,
        (err, data) => {
          if (err) reject("Database error");
          else resolve(data);
        }
      );
    });

    // If duplicate email or username exists, return error
    if (duplicateCheck.length > 0) throw "Email or username already exists";

    // Hash password
    req.body.password = bcrypt.hashSync(req.body.password, 11);

    // Create new user
    await new Promise((resolve, reject) => {
      Users.create(new Users(req.body), (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
    // Return success message
    res.json({ status: "success", message: "Sign up successfully" });
  } catch (err) {
    // Return error message
    res.json({ status: "error", message: err });
  }
};
