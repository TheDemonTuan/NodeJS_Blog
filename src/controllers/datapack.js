const message = require("../middlewares/message.js");
const Promise = require("bluebird");
const Post = Promise.promisifyAll(require("../models/posts.js"));
const Tag = Promise.promisifyAll(require("../models/tags.js"));

// [GET] /:slug
exports.show = async (req, res, next) => {
  try {
    const post = await Post.findBySlugAsync(req.params.slug);
    if (post) {
      res.locals.post = post;
      res.locals.recent_posts = await Post.getWithLimitNotSameIdAsync(post.id, 3);
      res.locals.tags = await Tag.getAllAsync();
      res.render("datapacks/datapack", { title: `Download datapack ${post.title} for minecraft` });
    }
    else
      next(new Error("Page not found"));
  } catch (err) {
    next(err);
  }
};
