// [GET] /
exports.index = async (req, res, next) => {
  console.log(res.locals.message);
  res.render("home", { title: "Home" });
};
