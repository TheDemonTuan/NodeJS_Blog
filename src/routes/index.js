const csrf = require("../middlewares/csrf.js");
const auth = require("../middlewares/auth.js");

function routes(app) {
  // Auth Middleware
  app.use("*", auth.jwtAuth);

  // Signup Router
  app.use("/signup", auth.isLogged, csrf.protection, require("./signup"));

  // Signin Router
  app.use("/signin", auth.isLogged, require("./signin"));

  // Home Router
  app.use("/", require("./home"));

  // Error Router
  app.use((req, res, next) => {
    res.status(404).render("errors/404", { title: "404" });
  });
}

module.exports = routes;
