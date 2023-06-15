module.exports = [
  (req, res, next) => {
    const error = new Error("Page not found");
    error.status = 404;
    next(error);
  },
  (err, req, res, next) => {
    if (!err.status) {
      err.status = 500;
      err.message = process.env.NODE_ENV == "production" ? "Internal Server Error" : err.message;
    }
    res.status(err.status).render("errors/error", { title: err.status, error_code: err.status, error_message: err.message });
  }];