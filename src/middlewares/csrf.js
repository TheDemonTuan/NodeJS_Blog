const csrf = require("@dr.pogodin/csurf");
exports.protection = [
  csrf({
    cookie: {
      key: process.env.CSRF_COOKIE_NAME,
      secure: true,
      httpOnly: true,
      sameSite: "strict",
      signed: true,
    },
  }),
  (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
  }
];