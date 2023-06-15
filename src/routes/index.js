'use strict'

const csrf = require("../middlewares/csrf");
const auth = require("../middlewares/auth");
const message = require("../middlewares/message");
const statusCheck = require("../middlewares/status");

module.exports = (app) => {
  // Middleware
  app.use(message.load, auth.token, statusCheck);

  // Admin Router
  app.use("/admin", auth.isAdmin, csrf, require("./admin"))

  // Signup Router
  app.use("/signup", auth.isLogged, csrf, require("./signup"));

  // Signin Router
  app.use("/signin", auth.isLogged, csrf, require("./signin"));

  // Logout Router
  app.use("/logout", auth.isNotLogged, require("./logout"));

  // Home Router
  app.use("/", require("./home"));

  // 404 Router
  app.use(require("./errors"));
}
