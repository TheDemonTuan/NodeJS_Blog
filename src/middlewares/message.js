const cookieParser = require("cookie-parser");

exports.create = (req, res, next, status, message, isRedirect = false, pageRedirect = "") => {
  res.cookie("message", `{"status": "${status}", "message":"${message}"}`, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    maxAge: 86400000,
    signed: true,
  });
  if (isRedirect) return res.redirect(pageRedirect ? pageRedirect : req.originalUrl);
  res.status(401).end("Unauthorized");
};

exports.check = (req, res, next) => {
  if (req.signedCookies.message && req.method == "GET") {
    //console.log(req.signedCookies.message);
    res.locals.showMessage = JSON.parse(req.signedCookies.message);
    res.clearCookie("message");
    next();
  } else {
    next();
  }
};
