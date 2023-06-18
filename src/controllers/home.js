const Promise = require("bluebird");
const Category = Promise.promisifyAll(require("../models/categories"));
const Post = Promise.promisifyAll(require("../models/posts"));

// [GET] /
exports.index = async (req, res, next) => {
  try {
    res.locals.posts = await Post.getAllAsync();
    res.locals.categories = await Category.getAllAsync();
    res.render("home", { title: "Home" });
  } catch (err) {
    next(err);
  }
};
