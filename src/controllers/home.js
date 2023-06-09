const Promise = require("bluebird");
const Group = Promise.promisifyAll(require("../models/groups"));

// [GET] /
exports.index = async (req, res, next) => {
  try {
    let result = await Group.home();
    res.locals.lastest_post = result[0][0];
    res.locals.lastest_updated_posts = result[1];
    res.locals.recent_posts = result[2];
    res.locals.categories = result[3];
    res.locals.tags = result[4];
    res.render("home", { title: "TheDemonTuan - Community sharing free datapacks for Minecraft." });
  } catch (err) {
    next(err);
  }
};
