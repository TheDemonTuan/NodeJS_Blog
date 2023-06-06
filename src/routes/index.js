const csrf = require("../middlewares/csrf.js");
const auth = require("../middlewares/auth.js");

function routes(app) {
  // Auth Middleware
  app.use("*", auth.jwtAuth);

  // Signup Router
  app.use("/signup", auth.isLogged, csrf.protection, require("./signup"));

  // Signin Router
  app.use("/signin", auth.isLogged, csrf.protection, require("./signin"));

  // Logout Router
  app.use("/logout", require("./logout"));

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
    // Xử lý lỗi 404
    if (err.status === 404) {
      res.status(404).render("errors/404", { title: err.status, error_code: err.status, error_message: err });
    } else {
      // Xử lý các lỗi khác
      res.status(500).render("errors/404", { title: "500", error_code: "500", error_message: err });
    }
  });
}

module.exports = routes;
