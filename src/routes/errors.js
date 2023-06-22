module.exports = [
  (req, res, next) => {
    next(new Error("Page not found"));
  },
  (err, req, res, next) => {
    if(err.message == "Page not found") {
      err.status = 404;
    }
    if (!err.status) {
      err.status = 400;
      err.message = process.env.NODE_ENV == "production" ? "Something went wrong, please try again later." : err.message;
    }
    res.status(err.status).render("errors/error", { title: err.status, error_code: err.status, error_message: err.message });
  }];