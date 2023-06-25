const Promise = require('bluebird');
const message = require("../middlewares/message");
const jwt = Promise.promisifyAll(require('jsonwebtoken'));
const User = require('../models/users');
const UserSetting = require('../models/users_settings');

const logOut = async (req, res, next) => {
  await Promise.all([res.clearCookie(process.env.JWT_COOKIE_NAME), redisClient.deleteUser(res.locals.userInfo.id)]);
  return message.set(req, res, next, "error", "Token is invalid", true, "/signin");
}

exports.token = async (req, res, next) => {
  const cookie = await req.signedCookies[process.env.JWT_COOKIE_NAME];
  if (cookie) {
    try {
      // check token is valid
      const { id: userId } = await jwt.verifyAsync(cookie, process.env.JWT_SECRET);
      // check user exists in redis
      if (!await redisClient.haveUser(userId)) {
        // get user from database
        [userInfo, userSettings] = await Promise.all([User.findById(userId), UserSetting.findByUserId(userId)]);
        // if user exists, set user to redis
        if (userInfo && userInfo.id === userId) {
          await redisClient.setUser(userId, JSON.stringify(userInfo), JSON.stringify(userSettings));
        }
        else {
          return logOut(req, res, next);
        };
      }
      else {
        // if some fields of user not exists in redis, set it
        if (!await redisClient.haveUserInfo(userId)) {
          let userInfo = await User.findById(userId);
          await redisClient.setUserInfo(userId, JSON.stringify(userInfo));
        };
        if (!await redisClient.haveUserSettings(userId)) {
          let userSettings = await UserSetting.findByUserId(userId);
          await redisClient.setUserSettings(userId, JSON.stringify(userSettings));
        };
      }
      // set user to res.locals
      [res.locals.userInfo, res.locals.userSettings] = await Promise.all([JSON.parse(await redisClient.getUserInfo(userId)), JSON.parse(await redisClient.getUserSettings(userId))]);
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