const router = require("express").Router();
const jwt = require("jsonwebtoken");
const con = require("../utils/db");
const message = require("../middlewares/message.js");

exports.jwtAuth = async (req, res, next) => {
  var cookie = req.cookies.token;
  if (cookie) {
    // Verify token
    try {
      // Set local variable
      res.locals.isLogged = await new Promise((resolve, reject) => {
        jwt.verify(cookie, process.env.COOKIE_SECRET, (err, decoded) => {
          if (err) reject(err);
          else resolve(decoded.id);
        });
      });
    } catch (err) {
      res.clearCookie("token");
      return res.redirect("/signin");
    }
  }
  next();
};

exports.isLogged = async (req, res, next) => {
  if (res.locals.isLogged) 
    return message.create(req, res, next, "warning", "You are logged in", true, "/");
  next();
};
