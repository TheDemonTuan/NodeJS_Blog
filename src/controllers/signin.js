const Users = require("../models/users.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Promise = require("bluebird");
const message = require("../middlewares/message.js");
// [GET] /
exports.index = async (req, res, next) => {
  res.render("signin", { title: "Sign in" });
};

// [POST] /
exports.checkLogin = async (req, res, next) => {
  try {
    // Check user exists
    var user = await new Promise((resolve, reject) => {
      Users.findByUsername(req.body.username, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    // If username not exists , return error
    if (user.length == 0) throw "Username or password is incorrect";

    // Check password
    if (!bcrypt.compareSync(req.body.password, user[0].password))
      throw "Username or password is incorrect";

    res.clearCookie("token");
    res.cookie(
      "token",
      jwt.sign({ id: user[0].id }, process.env.COOKIE_SECRET, {
        expiresIn: "1d",
      }),
      { httpOnly: true, sameSite: "strict", secure: true, maxAge: 86400000}
    );
    message.create(res, "success", "Sign in successfully");
    // Return success message
    res.json({ status: "success", message: "Sign in successfully" });
  } catch (err) {
    // Return error message
    res.json({ status: "error", message: err });
    console.log(err);
  }
};
