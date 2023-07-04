const Promise = require('bluebird');
const jwt = Promise.promisifyAll(require("jsonwebtoken"));
const bcrypt = require("bcrypt");
const message = require("../middlewares/message.js");
const Users = require('../models/users');
const ActivityLog = require('../models/activity_logs');

// [GET] /
exports.index = async (req, res, next) => {
  res.render("signin", { title: "Sign in" });
};

// [POST] /submit
exports.check = async (req, res, next) => {
  try {
    // Check user exists
    const user = await Users.findByUsername(req.body.username);

    // if user not exists or password is incorrect
    if (!user || !bcrypt.compareSync(req.body.password, user.password))
      return message.set(req, res, next, "error", "Username or password is incorrect", true, '.');

    const createToken = jwt.signAsync({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    const result = await Promise.all([redisClient.setUserInfo(user.id, JSON.stringify(user)), ActivityLog.create(user, 'Signin', req), createToken]);

    await res.cookie(process.env.JWT_COOKIE_NAME, result.at(-1), { httpOnly: true, sameSite: "lax", secure: true, signed: true, maxAge: 86400000 });

    // Return success message
    message.set(req, res, next, "success", "Sign in successfully", true, "/");
  } catch (err) {
    // Return error message
    next(err);
  }
};
