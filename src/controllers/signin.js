const Users = require("../models/users.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

    // if user not exists or password is incorrect
    if (user.length == 0 || !bcrypt.compareSync(req.body.password, user[0].password))
      return message.create(req, res, next, "error", "Username or password is incorrect", true);

    // Create token
    const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie(process.env.JWT_COOKIE_NAME, token, { httpOnly: true, sameSite: "lax", secure: true, signed: true, maxAge: 86400000 });
    // Return success message
    return message.create(req, res, next, "success", "Sign in successfully", true, "/");
  } catch (err) {
    // Return error message
    //console.log(err);
    return message.create(req, res, next, "error", "Something went wrong", true);
  }
};
