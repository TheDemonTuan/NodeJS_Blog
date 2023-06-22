const Promise = require('bluebird');
const message = require("../middlewares/message");
const jwt = Promise.promisifyAll(require('jsonwebtoken'));
const Users = Promise.promisifyAll(require('../models/users'));

const logOut = async (req, res, next) => {
  await res.clearCookie(process.env.JWT_COOKIE_NAME);
  await _redisClient.del(res.locals.userInfo.id);
  return message.set(req, res, next, "error", "Token is invalid", true, "/signin");
}

exports.token = async (req, res, next) => {
  const cookie = req.signedCookies[process.env.JWT_COOKIE_NAME];
  if (cookie) {
    try {
      // check token is valid
      const { id: userId } = await jwt.verifyAsync(cookie, process.env.JWT_SECRET);
      // check user exists in redis
      if (!await _redisClient.exists(userId)) {
        // get user from database
        const userGet = await Users.findByIdAsync(userId);
        // if user exists, set user to redis
        if (userGet && userGet.id === userId) {
          await _redisClient.set(userId, JSON.stringify(userGet), "EX", 300);
        } 
        // if user not exists, logout
        else {
          return logOut(req, res, next);
        }
      }
      // set user info to res.locals
      res.locals.userInfo = JSON.parse(await _redisClient.get(userId));
    } catch (err) {
      return logOut(req, res, next);
    }
  } 
  // if cookie invalid, logout
  else if (cookie === false) {
    return logOut(req, res, next);
  }
  next();
};

// middleware block access to page if logged in
exports.isLogged = async (req, res, next) => {
  if (res.locals.userInfo) 
    return message.set(req, res, next, "warning", "You are logged in", true, "/");
  next();
};

// middleware block access to page if not logged
exports.isNotLogged = async (req, res, next) => {
  if (!res.locals.userInfo)
    return message.set(req, res, next, "warning", "You are not logged in", true, "/signin");
  next();
};

// middleware block access to page if not admin
exports.isAdmin = async (req, res, next) => {
  if (!res.locals.userInfo.role) {
    return next(new Error("Page not found"));
  }
  next();
}