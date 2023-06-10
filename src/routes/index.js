"use strict"

const csrf = require("../middlewares/csrf.js");
const auth = require("../middlewares/auth.js");
const rate_limit = require("../middlewares/rate-limit.js");
const message = require("../middlewares/message.js");
const configs = require("../middlewares/configs.js");

function routes(app) {
  // Middleware
  const middlewares = [rate_limit.all, message.check, auth.jwt, configs.load]
  app.use(middlewares);

  app.use("/admin", auth.isAdmin, csrf.protection, require("./admin"))

  // Signup Router
  app.use("/signup", auth.isLogged, rate_limit.signup, csrf.protection, require("./signup"));

  // Signin Router
  app.use("/signin", auth.isLogged, rate_limit.signin, csrf.protection, require("./signin"));

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
    if (!err.status) {
      //console.log(err)
      err.status = 500;
      err.message = process.env.NODE_ENV == "production" ? "Internal Server Error" : err.message;
    }
    res.status(err.status).render("errors/error", { title: err.status, error_code: err.status, error_message: err.message });
  });
}

module.exports = routes;
