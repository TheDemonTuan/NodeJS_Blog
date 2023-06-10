const Promise = require('bluebird');
const message = require("../middlewares/message");
const jwt = Promise.promisifyAll(require('jsonwebtoken'));
const Users = Promise.promisifyAll(require('../models/users')); // Chuyển đổi module Users thành Promise-based

const logOut = (req, res, next) => {
  res.clearCookie(process.env.JWT_COOKIE_NAME);
  message.create(req, res, next, "error", "Token is invalid", true, "/signin");
}

exports.jwt = async (req, res, next) => {
  const cookie = req.signedCookies[process.env.JWT_COOKIE_NAME];
  if (cookie) {
    try {
      const { id: userId } = await jwt.verifyAsync(cookie, process.env.JWT_SECRET);
      if (!req.session[process.env.SESSION_INFO_NAME]) {
        const userGet = await Users.findByIdAsync(userId);
        if (userGet.length > 0 && userGet[0].id === userId) {
          req.session[process.env.SESSION_INFO_NAME] = res.locals[process.env.SESSION_INFO_NAME] = userGet[0];
        } else {
          logOut(req, res, next);
        }
      } else {
        res.locals[process.env.SESSION_INFO_NAME] = req.session[process.env.SESSION_INFO_NAME];
      }
    } catch (err) {
      return logOut(req, res, next);
    }
  } else if (cookie === false) {
    return logOut(req, res, next);
  }
  else {
    if (req.session[process.env.SESSION_INFO_NAME])
      delete req.session[process.env.SESSION_INFO_NAME];
  }

  next();
};

exports.isLogged = async (req, res, next) => {
  if (res.locals[process.env.SESSION_INFO_NAME]) {
    return message.create(req, res, next, "warning", "You are logged in", true, "/");
  }
  next();
};

// middleware block access to page if not logged
exports.isNotLogged = async (req, res, next) => {
  if (!res.locals[process.env.SESSION_INFO_NAME])
    return message.create(req, res, next, "warning", "You are not logged in", true, "/signin");
  next();
};

// middleware block access to page if not admin
exports.isAdmin = async (req, res, next) => {
  if (!res.locals[process.env.SESSION_INFO_NAME].role) {
    const error = new Error("Page not found");
    error.status = 404;
    next(error);
  }
  next();
}