var csrf = require("@dr.pogodin/csurf");
var csrfProtection = csrf({
  cookie: {
    key: "csrfToken",
    secure: true,
    httpOnly: true,
    sameSite : "strict",
    signed: true,
  },
});
function routes(app) {
  // Signup Router
  app.use("/signup", csrfProtection, require("./signup"));

  // Signin Router
  app.use("/signin", csrfProtection, require("./signin"));

  // Home Router
  app.use("/", require("./home"));

  // Error Router
  app.use((err, req, res, next) => {
    res.status(404).render("errors/404", { title: "404" });
  });
}

module.exports = routes;
