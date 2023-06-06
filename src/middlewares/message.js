const cookieParser = require("cookie-parser");

exports.create = (res, status, message) => {
  res.cookie("message", `{status:${status},message:${message}}`, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    maxAge: 86400000,
    signed: true,
  });
};

exports.check = (req, res, next) => {
  if (req.signedCookies.message) {
    //console.log(req.signedCookies.message);
    res.locals.message = req.signedCookies.message;
    next();
  }
  else {
    next();
  }
};
