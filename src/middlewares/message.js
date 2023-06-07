exports.create = (req, res, next, status, message, isRedirect = false, pageRedirect = "") => {
  req.session.message = `{"status": "${status}", "message":"${message}"}`;
  if (isRedirect) return res.redirect(pageRedirect ? pageRedirect : req.originalUrl);
  res.status(401).end("Unauthorized");
};

exports.check = (req, res, next) => {
  if (req.session.message && req.method == "GET") {
    try {
      res.locals.showMessage = JSON.parse(req.session.message);
    } catch (err) {
      console.log(err);
      res.locals.showMessage = JSON.parse('{"status": "error", "message":"Something went wrong"}')
    }
  }
  delete req.session.message;
  next();
};
