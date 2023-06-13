'use strict'

const csrf = require("../middlewares/csrf");
const auth = require("../middlewares/auth");
const rateLimit = require("../middlewares/rate-limit");
const message = require("../middlewares/message");
const statusCheck = require("../middlewares/status");

function routes(app) {
  // Middleware
  const middlewares = [rateLimit.all, message.load, auth.token, statusCheck]
  app.use(middlewares);

  // Admin Router
  app.use("/admin", auth.isAdmin, csrf.protection, require("./admin"))

  // Signup Router
  app.use("/signup", auth.isLogged, rateLimit.signup, csrf.protection, require("./signup"));

  // Signin Router
  app.use("/signin", auth.isLogged, rateLimit.signin, csrf.protection, require("./signin"));

  // Logout Router
  app.use("/logout", auth.isNotLogged, require("./logout"));

  // Home Router
  app.use("/", require("./home"));

  // 404 Router
  app.use((req, res, next) => {
    const error = new Error("Page not found");
    error.status = 404;
    next(error);
  });

  // Error Handler
  app.use((err, req, res, next) => {
    if(err == "Too many requests, please try again later.")
      return res.status(429).render("errors/error", { title: 429, error_code: 429, error_message: err });
    if (!err.status) {
      err.status = 500;
      err.message = process.env.NODE_ENV == "production" ? "Internal Server Error" : err.message;
    }
    res.status(err.status).render("errors/error", { title: err.status, error_code: err.status, error_message: err.message });
  });
}

module.exports = routes;
