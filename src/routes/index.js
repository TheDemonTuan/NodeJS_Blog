const csrf = require("../middlewares/csrf.js");
const auth = require("../middlewares/auth.js");
const limit = require("../middlewares/rate-limit.js");

function routes(app) {
  // Auth Middleware
  app.use("*", limit.all, auth.jwtAuth);

  // Signup Router
  app.use("/signup", auth.isLogged, limit.signup, csrf.protection, require("./signup"));

  // Signin Router
  app.use("/signin", auth.isLogged, limit.signin, csrf.protection, require("./signin"));

  // Logout Router
  app.use("/logout", auth.isNotLogged, require("./logout"));

  // Home Router
  app.use("/", require("./home"));

  // 404 Router
  app.use((req, res, next) => {
    const error = new Error('Page not found');
    error.status = 404;
    next(error);
  });

  // Error Handler
  app.use((err, req, res, next) => {
    res.status(err.status).render("errors/error", { title: err.status, error_code: err.status, error_message: err });
  });
}

module.exports = routes;
