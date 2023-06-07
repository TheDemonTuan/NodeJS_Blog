const router = require("express").Router();
const jwt = require("jsonwebtoken");
const message = require("../middlewares/message");
const Users = require("../models/users");

// midleware for jwt check
exports.jwtAuth = async (req, res, next) => {
  var cookie = req.cookies.token;
  if (cookie) {
    // Verify token
    try {
      // Get user id from token
      var userId = await new Promise((resolve, reject) => {
        jwt.verify(cookie, process.env.JWT_SECRET, (err, decoded) => {
          if (err) reject(err);
          else resolve(decoded.id);
        });
      });
      // Check user id from token if not in session
      if (!req.session.userInfo) {
        // Get user info from database
        var userGet = await new Promise((resolve, reject) => {
          Users.findById(userId, (err, data) => {
            if (err) reject(err);
            else resolve(data);
          });
        });
        // Check user info
        if (userGet.length > 0 && userGet[0].id == userId) {
          req.session.userInfo = userGet;
        }
        else
          throw new Error("Who are u ?");
      }
      // isLogged Set
      res.locals.isLogged = true;
    } catch (err) {
      //console.log(err);
      res.clearCookie("token");
      return message.create(req, res, next, "error", "Token is invalid", true, "/signin");
    }
  }
  else
    res.locals.isLogged = false;
  next();
};

// middleware block access to page if logged
exports.isLogged = async (req, res, next) => {
  if (res.locals.isLogged)
    return message.create(req, res, next, "warning", "You are logged in", true, "/");
  next();
};

// middleware block access to page if not logged
exports.isNotLogged = async (req, res, next) => {
  if (!res.locals.isLogged)
    return message.create(req, res, next, "warning", "You are not logged in", true, "/signin");
  next();
};
