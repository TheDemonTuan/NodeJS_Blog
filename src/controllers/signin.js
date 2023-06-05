const Users = require("../models/users.js");
const bcrypt = require("bcrypt");

// [GET] /
exports.index = async (req, res, next) => {
  res.render("signin", { title: "Sign in" , csrfToken: req.csrfToken()});
};

// [POST] /
exports.checkLogin = async (req, res, next) => {
  try {
    // Check user exists
    var user = await new Promise((resolve, reject) => {
      Users.findByUsername(req.body.username, (err, data) => {
        if (err) reject("Database error");
        else resolve(data);
      });
    });

    // If username not exists , return error
    if (user.length == 0) throw "Username or password is incorrect";

    // Check password
    if (!bcrypt.compareSync(req.body.password, user[0].password))
      throw "Username or password is incorrect";

    // Return success message
    res.json({ status: "success", message: "Sign in successfully" });
  } catch (err) {
    // Return error message
    res.json({ status: "error", message: err });
  }
};
