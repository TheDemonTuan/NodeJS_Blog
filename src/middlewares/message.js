exports.set = async (req, res, next, status, message, isRedirect = false, pageRedirect = "") => {
  req.session.message = `{"status": "${status}", "message":"${message}"}`;
  delete req.headers.referer;
  if (isRedirect) return res.redirect(pageRedirect ? pageRedirect : req.originalUrl);
  next();
};

exports.load = async (req, res, next) => {
  if (req.session.message && req.method == "GET") {
    try {
      res.locals.showMessage = JSON.parse(req.session.message);
    } catch (err) {
      delete req.session.message;
      return next(err)
    }
  }
  delete req.session.message;
  next();
};
