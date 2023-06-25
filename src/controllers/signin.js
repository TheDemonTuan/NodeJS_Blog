const Promise = require('bluebird');
const Users = require('../models/users');
const jwt = Promise.promisifyAll(require("jsonwebtoken"));
const bcrypt = require("bcrypt");
const message = require("../middlewares/message.js");

// [GET] /
exports.index = async (req, res, next) => {
  res.render("signin", { title: "Sign in" });
};

// [POST] /
exports.check = async (req, res, next) => {
  try {
    // Check user exists
    var user = await Users.findByUsername(req.body.username);

    // if user not exists or password is incorrect
    if (!user || !bcrypt.compareSync(req.body.password, user.password))
      return message.set(req, res, next, "error", "Username or password is incorrect", true, '.');

    if (redisClient.haveUser(user.id))
      redisClient.deleteUser(user.id);
    
    // Create token
    const token = await jwt.signAsync({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie(process.env.JWT_COOKIE_NAME, token, { httpOnly: true, sameSite: "lax", secure: true, signed: true, maxAge: 86400000 });

    // Return success message
    message.set(req, res, next, "success", "Sign in successfully", true, "/");
  } catch (err) {
    // Return error message
    message.set(req, res, next, "error", "Can't sign in, please try again later.", true, '.');
  }
};
