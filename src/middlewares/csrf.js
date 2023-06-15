const { doubleCsrf } = require("csrf-csrf");

const { invalidCsrfTokenError, generateToken, validateRequest, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET,
  cookieName: process.env.CSRF_COOKIE_NAME,
  cookieOptions: { sameSite: true, secure: true, signed: true }, // not ideal for production, development only
  size: 64,
  ignoredMethods: ["GET", "HEAD", "OPTIONS"],
  getTokenFromRequest: (req) => req.query.csrftoken ?? req.body["_csrf"] ?? req.headers["x-csrf-token"], // A function that returns the token from the request
});


const csrfErrorHandler = async (error, req, res, next) => {
  console.log(req.query.token)
  if (error == invalidCsrfTokenError)
    return next(new Error("Invalid CSRF token"));
  next();
};

module.exports = [
  doubleCsrfProtection,
  csrfErrorHandler,
  async (req, res, next) => {
    res.locals.csrfToken = generateToken(res, req);
    next();
  },
]