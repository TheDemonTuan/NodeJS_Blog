const Promise = require("bluebird");
// [GET] /
exports.index = async (req, res, next) => {
  try {
    res.render("datapacks/all-datapacks", { title: "All best datapacks for minecraft" });
  } catch (err) {
    next(err);
  }
};
