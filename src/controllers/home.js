// [GET] /
exports.index = async (req, res, next) => {
  res.render("home", { title: "Home" });
};
