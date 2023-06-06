const csrf = require("@dr.pogodin/csurf");
exports.protection = csrf({
  cookie: {
    key: "csrfToken",
    secure: true,
    httpOnly: true,
    sameSite: "strict",
    signed: true,
  },
});