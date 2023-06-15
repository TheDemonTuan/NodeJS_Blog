const Promise = require('bluebird');
const Users = Promise.promisifyAll(require('../models/users'));
const jwt = Promise.promisifyAll(require("jsonwebtoken"));
const bcrypt = require("bcrypt");
const message = require("../middlewares/message.js");

// [GET] /
exports.index = async (req, res, next) => {
  res.locals.old_username = req.query.username ? req.query.username : false;
  res.render("signin", { title: "Sign in" });
};

// [POST] /
exports.checkLogin = async (req, res, next) => {
  try {
    // Check user exists
    var user = await Users.findByUsernameAsync(req.body.username);

    // if user not exists or password is incorrect
    if (user.length == 0 || !bcrypt.compareSync(req.body.password, user[0].password))
      return message.set(req, res, next, "error", "Username or password is incorrect", true,`/signin?username=${req.body.username}`);

    // Create token
    const token = await jwt.signAsync({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const jwtCookie = res.cookie(process.env.JWT_COOKIE_NAME, token, { httpOnly: true, sameSite: "lax", secure: true, signed: true, maxAge: 86400000 });

    // Return success message
    return message.set(req, res, next, "success", "Sign in successfully", true, "/");
  } catch (err) {
    // Return error message
    //console.log(err);
    return message.set(req, res, next, "error", "Can't sign in, please try again later.", true);
  }
};
