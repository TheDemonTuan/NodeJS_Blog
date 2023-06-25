const { doubleCsrf } = require("csrf-csrf");

const { invalidCsrfTokenError, generateToken, validateRequest, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET,
  cookieName: process.env.CSRF_COOKIE_NAME,
  cookieOptions: { sameSite: true, secure: true, signed: true }, // not ideal for production, development only
  size: 64,
  ignoredMethods: ["GET", "HEAD", "OPTIONS"],
  getTokenFromRequest: (req) => req.query.csrfToken ?? req.body["_csrf"] ?? req.headers["x-csrf-token"], // A function that returns the token from the request
});


const csrfErrorHandler = async (error, req, res, next) => {
  if (error == invalidCsrfTokenError)
    next(new Error("Invalid CSRF token"));
  else if (error)
    next(error);
  else next();
};

module.exports = [
  doubleCsrfProtection,
  csrfErrorHandler,
  async (req, res, next) => {
    res.locals.csrfToken = generateToken(res, req);
    next();
  },
]