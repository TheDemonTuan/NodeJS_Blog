const message = require("../middlewares/message");
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const User = Promise.promisifyAll(require("../models/users"));
const Category = Promise.promisifyAll(require("../models/categories"));
const Tag = Promise.promisifyAll(require("../models/tags"));
const Post = Promise.promisifyAll(require("../models/posts"));

// White list
const userWhiteList = ['thedemontuan'];

//----------------------------------------------Settings----------------------------------------------

// [GET] /settings
exports.settingsIndex = async (req, res, next) => {
  res.render("admin/settings", { title: "Website Settings", maintenance: await _redisClient.exists("maintenance") });
};

// [POST] /settings
exports.settingsUpdate = async (req, res, next) => {
  try {
    if (req.body.maintenance)
      await _redisClient.set("maintenance", "true");
    else
      await _redisClient.del("maintenance");
    return message.set(req, res, next, "success", "Settings updated successfully.", true, "/admin/settings");
  } catch (err) {
    next(err);
  }
};

//----------------------------------------------Users----------------------------------------------
// [GET] /users
exports.usersIndex = async (req, res, next) => {
  try {
    res.locals.users = await User.getAllAsync();
    res.render("admin/users", { title: "Users" });
  } catch (err) {
    next(err);
  }
};

// [GET] /users/add
exports.usersAdd = async (req, res, next) => {
  res.render("admin/users/add", { title: "Add User" });
};

// [GET] /users/edit/:id
exports.usersEdit = async (req, res, next) => {
  try {
    res.locals.user = await User.findByIdAsync(req.params.id);
    res.render("admin/users/edit", { title: "Edit User" });
  }
  catch (err) {
    next(err);
  }
};

// [GET] /users/delete/:id
exports.usersDelete = async (req, res, next) => {
  try {
    res.locals.user = await User.findByIdAsync(req.params.id);
    res.render("admin/users/delete", { title: "Delete User" });
  }
  catch (err) {
    next(err);
  }
};

// [POST] /users/add
exports.usersStore = async (req, res, next) => {
  try {
    await User.createAsync(req.body);
    return message.set(req, res, next, "success", "User added successfully.", true, "/admin/users");
  } catch (err) {
    next(err);
  }
};

// [POST] /users/edit/:id
exports.usersUpdate = async (req, res, next) => {
  try {
    const user = await User.findByIdAsync(req.params.id);

    if (req.body.password == "" || req.body.password == null)
      delete req.body.password;

    if (userWhiteList.includes(user.username) && !userWhiteList.includes(res.locals.userInfo.username))
      return message.set(req, res, next, "error", "You can't edit this account.", true, "/admin/users");

    await User.updateByIdAsync(user.id, req.body);
    await _redisClient.del(user.id);
    return message.set(req, res, next, "success", "User updated successfully.", true, "/admin/users");
  } catch (err) {
    next(err);
  }
};

// [POST] /users/delete/:id
exports.usersDestroy = async (req, res, next) => {
  try {
    const user = await User.findByIdAsync(req.params.id);

    if (!user)
      return message.set(req, res, next, "error", "User not found.", true, "/admin/users");

    if (res.locals.userInfo.id == user.id)
      return message.set(req, res, next, "error", "You can't delete your own account.", true, "/admin/users");

    if (userWhiteList.includes(user.username))
      return message.set(req, res, next, "error", "You can't delete this account.", true, "/admin/users");

    await User.deleteByIdAsync(user.id);
    await _redisClient.del(user.id);
    return message.set(req, res, next, "success", "User deleted successfully.", true, "/admin/users");
  } catch (err) {
    next(err);
  }
};

//----------------------------------------------Categories----------------------------------------------

// [GET] /categories
exports.categoriesIndex = async (req, res, next) => {
  try {
    res.locals.categories = await Category.getAllAsync();
    res.render("admin/categories", { title: "Categories" });
  } catch (err) {
    next(err);
  }
};

// [GET] /categories/add
exports.categoriesAdd = async (req, res, next) => {
  res.render("admin/categories/add", { title: "Add Category" });
};

// [GET] /categories/edit/:id
exports.categoriesEdit = async (req, res, next) => {
  try {
    res.locals.category = await Category.findByIdAsync(req.params.id);
    res.render("admin/categories/edit", { title: "Edit Category" });
  } catch (err) {
    next(err);
  }
};

// [GET] /categories/delete/:id
exports.categoriesDelete = async (req, res, next) => {
  try {
    res.locals.category = await Category.findByIdAsync(req.params.id);
    res.render("admin/categories/delete", { title: "Delete Category" });
  } catch (err) {
    next(err);
  }
};

// [POST] /categories/add
exports.categoriesStore = async (req, res, next) => {
  try {
    await Category.createAsync(req.body);
    return message.set(req, res, next, "success", "Category added successfully.", true, "/admin/categories")
  } catch (err) {
    next(err);
  }
};

// [POST] /categories/edit/:id
exports.categoriesUpdate = async (req, res, next) => {
  try {
    req.body.updatedAt = new Date();
    await Category.updateByIdAsync(req.params.id, req.body);
    return message.set(req, res, next, "success", "Category updated successfully.", true, "/admin/categories")
  } catch (err) {
    next(err);
  }
};

// [POST] /categories/delete/:id
exports.categoriesDestroy = async (req, res, next) => {
  try {
    await Category.deleteByIdAsync(req.params.id);
    return message.set(req, res, next, "success", "Category deleted successfully.", true, "/admin/categories")
  } catch (err) {
    next(err);
  }
};

//----------------------------------------------Tags----------------------------------------------

// [GET] /tags
exports.tagsIndex = async (req, res, next) => {
  try {
    res.locals.tags = await Tag.getAllAsync();
    res.render("admin/tags", { title: "Tags" });
  } catch (err) {
    next(err);
  }
};

// [GET] /tags/add
exports.tagsAdd = async (req, res, next) => {
  res.render("admin/tags/add", { title: "Add Tag" });
};

// [GET] /tags/edit/:id
exports.tagsEdit = async (req, res, next) => {
  try {
    res.locals.tag = await Tag.findByIdAsync(req.params.id);
    res.render("admin/tags/edit", { title: "Edit Tag" });
  } catch (err) {
    next(err);
  }
};

// [GET] /tags/delete/:id
exports.tagsDelete = async (req, res, next) => {
  try {
    res.locals.tag = await Tag.findByIdAsync(req.params.id);
    res.render("admin/tags/delete", { title: "Delete Tag" });
  } catch (err) {
    next(err);
  }
};

// [POST] /tags/add
exports.tagsStore = async (req, res, next) => {
  try {
    await Tag.createAsync(req.body);
    return message.set(req, res, next, "success", "Tag added successfully.", true, "/admin/tags")
  } catch (err) {
    next(err);
  }
};

// [POST] /tags/edit/:id
exports.tagsUpdate = async (req, res, next) => {
  try {
    req.body.updatedAt = new Date();
    await Tag.updateByIdAsync(req.params.id, req.body);
    return message.set(req, res, next, "success", "Tag updated successfully.", true, "/admin/tags")
  } catch (err) {
    next(err);
  }
};

// [POST] /tags/delete/:id
exports.tagsDestroy = async (req, res, next) => {
  try {
    await Tag.deleteByIdAsync(req.params.id);
    return message.set(req, res, next, "success", "Tag deleted successfully.", true, "/admin/tags")
  } catch (err) {
    next(err);
  }
};

//----------------------------------------------Posts----------------------------------------------

// [GET] /posts
exports.postsIndex = async (req, res, next) => {
  try {
    res.locals.posts = await Post.getAllAsync();
    res.render("admin/posts", { title: "Posts" });
  } catch (err) {
    next(err);
  }
};

// [GET] /posts/add
exports.postsAdd = async (req, res, next) => {
  try {
    res.locals.categories = await Category.getAllAsync();
    res.locals.tags = await Tag.getAllAsync();
    res.render("admin/posts/add", { title: "Add Post" });
  } catch (err) {
    next(err);
  }
};

// [GET] /posts/edit/:id
exports.postsEdit = async (req, res, next) => {
  try {
    res.locals.categories = await Category.getAllAsync();
    res.locals.tags = await Tag.getAllAsync();
    res.locals.post = await Post.findByIdAsync(req.params.id);
    res.render("admin/posts/edit", { title: "Edit Post" });
  } catch (err) {
    next(err);
  }
};

// [GET] /posts/delete/:id
exports.postsDelete = async (req, res, next) => {
  try {
    res.locals.post = await Post.findByIdAsync(req.params.id);
    res.locals.tags = await Tag.getAllAsync();
    res.render("admin/posts/delete", { title: "Delete Post" });
  } catch (err) {
    next(err);
  }
};

// [POST] /posts/add
exports.postsStore = async (req, res, next) => {
  try {
    await Post.createAsync(req.body);
    return message.set(req, res, next, "success", "Post added successfully.", true, "/admin/posts")
  } catch (err) {
    next(err);
  }
}

// [POST] /posts/edit/:id
exports.postsUpdate = async (req, res, next) => {
  try {
    req.body.updatedAt = new Date();
    if(req.body.link_status)
      req.body.link = `/${req.body.category_slug}/${req.body.slug}`
    await Post.updateByIdAsync(req.params.id, req.body);
    return message.set(req, res, next, "success", "Post updated successfully.", true, "/admin/posts")
  } catch (err) {
    next(err);
  }
}

// [POST] /posts/delete/:id
exports.postsDestroy = async (req, res, next) => {
  try {
    const post = await Post.findByIdAsync(req.params.id);
    await fs.unlinkAsync(staticPath + post.thumbnail);
    await Post.deleteByIdAsync(req.params.id);
    return message.set(req, res, next, "success", "Post deleted successfully.", true, "/admin/posts")
  } catch (err) {
    next(err);
  }
}

//----------------------------------------------Dashboard----------------------------------------------
// [GET] /
exports.dashboardIndex = async (req, res, next) => {
  res.render("admin", { title: "Admin Dashboard" });
};
