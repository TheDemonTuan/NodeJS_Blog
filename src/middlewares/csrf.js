const csrf = require("@dr.pogodin/csurf");
exports.protection = csrf({
  cookie: {
    key: "__tdt_csrf",
    secure: true,
    httpOnly: true,
    sameSite: "strict",
    signed: true,
  },
});