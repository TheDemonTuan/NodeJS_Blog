const message = require("../middlewares/message");
const Promise = require('bluebird');
const Category = Promise.promisifyAll(require("../models/categories"));
const User = Promise.promisifyAll(require("../models/users"));

const whilelist = ['thedemontuan'];

//----------------------------------------------Settings----------------------------------------------

// [GET] /settings
exports.settingsIndex = async (req, res, next) => {
    res.render("admin/settings", { title: "Website Settings", maintenance: await _redisClient.exists("maintenance") });
};

// [POST] /settings
exports.settingsStore = async (req, res, next) => {
    try {
        if (req.body.maintenance)
            _redisClient.set("maintenance", "true");
        else
            _redisClient.del("maintenance");
        return message.create(req, res, next, "success", "Settings updated successfully.", true, "/admin/settings");
    } catch (err) {
        return message.create(req, res, next, "error", "Something went wrong, please try again later.", true, "/admin/settings");
    }
};

//----------------------------------------------Users----------------------------------------------
// [GET] /users
exports.usersIndex = async (req, res, next) => {
    res.locals.users = await User.getAllAsync();
    res.render("admin/users", { title: "Users" });
};

// [GET] /users/add
exports.usersAdd = async (req, res, next) => {
    res.render("admin/users/add", { title: "Add User" });
};

// [GET] /users/edit/:id
exports.usersEdit = async (req, res, next) => {
    res.locals.user = await User.findByIdAsync(req.params.id);
    res.render("admin/users/edit", { title: "Edit User" });
};

// [GET] /users/delete/:id
exports.usersDelete = async (req, res, next) => {
    res.locals.user = await User.findByIdAsync(req.params.id);
    res.render("admin/users/delete", { title: "Delete User" });
};

// [POST] /users/add
exports.usersStore = async (req, res, next) => {
    try {
        await User.createAsync(req.body);
        return message.create(req, res, next, "success", "User added successfully.", true, "/admin/users");
    } catch (error) {
        return message.create(req, res, next, "error", "Something went wrong, please try again later.", true, "/admin/users");
    }
};

// [POST] /users/edit/:id
exports.usersUpdate = async (req, res, next) => {
    const user = await User.findByIdAsync(req.params.id);

    if (req.body.password == "" || req.body.password == null)
        delete req.body.password;

    if (whilelist.includes(user.username) && !whilelist.includes(res.locals.userInfo.username))
        return message.create(req, res, next, "error", "You can't edit this account.", true, "/admin/users");

    try {
        await User.updateByIdAsync(user.id, req.body);
        await _redisClient.del(user.id);
        return message.create(req, res, next, "success", "User updated successfully.", true, "/admin/users");
    } catch (error) {
        return message.create(req, res, next, "error", "Something went wrong, please try again later.", true, "/admin/users");
    }
};

// [POST] /users/delete/:id
exports.usersDestroy = async (req, res, next) => {
    const user = await User.findByIdAsync(req.params.id);

    if (!user)
        return message.create(req, res, next, "error", "User not found.", true, "/admin/users");

    if (res.locals.userInfo.id == user.id)
        return message.create(req, res, next, "error", "You can't delete your own account.", true, "/admin/users");

    if (whilelist.includes(user.username))
        return message.create(req, res, next, "error", "You can't delete this account.", true, "/admin/users");

    try {
        await User.deleteByIdAsync(user.id);
        await _redisClient.del(user.id);
        return message.create(req, res, next, "success", "User deleted successfully.", true, "/admin/users");
    } catch (error) {
        return message.create(req, res, next, "error", "Something went wrong, please try again later.", true, "/admin/users");
    }
};

//----------------------------------------------Categories----------------------------------------------

// [GET] /categories
exports.categoriesIndex = async (req, res, next) => {
    res.locals.categories = await Category.getAllAsync();
    res.render("admin/categories", { title: "Categories" });
};

// [GET] /categories/add
exports.categoriesAdd = async (req, res, next) => {
    res.render("admin/categories/add", { title: "Add Category" });
};

// [GET] /categories/edit/:id
exports.categoriesEdit = async (req, res, next) => {
    res.locals.category = await Category.findByIdAsync(req.params.id);
    res.render("admin/categories/edit", { title: "Edit Category" });
};

// [GET] /categories/delete/:id
exports.categoriesDelete = async (req, res, next) => {
    res.locals.category = await Category.findByIdAsync(req.params.id);
    res.render("admin/categories/delete", { title: "Delete Category" });
};

// [POST] /categories/add
exports.categoriesStore = async (req, res, next) => {
    try {
        await Category.createAsync(req.body);
        return message.create(req, res, next, "success", "Category added successfully.", true, "/admin/categories")
    } catch (error) {
        //console.log(error)
        return message.create(req, res, next, "error", "Something went wrong, please try again later.", true, "/admin/categories")
    }
};

// [POST] /categories/edit/:id
exports.categoriesUpdate = async (req, res, next) => {
    try {
        req.body.updatedAt = new Date();
        await Category.updateByIdAsync(req.params.id, req.body);
        return message.create(req, res, next, "success", "Category updated successfully.", true, "/admin/categories")
    } catch (error) {
        console.log(error)
        return message.create(req, res, next, "error", "Something went wrong, please try again later.", true, "/admin/categories")
    }
};

// [POST] /categories/delete/:id
exports.categoriesDestroy = async (req, res, next) => {
    try {
        await Category.deleteByIdAsync(req.params.id);
        return message.create(req, res, next, "success", "Category deleted successfully.", true, "/admin/categories")
    } catch (error) {
        //console.log(error)
        return message.create(req, res, next, "error", "Something went wrong, please try again later.", true, "/admin/categories")
    }
};

//----------------------------------------------Posts----------------------------------------------

// [GET] /posts
exports.postsIndex = async (req, res, next) => {
    res.render("admin/posts", { title: "Posts" });
};

// [GET] /
exports.dashboardIndex = async (req, res, next) => {
    res.render("admin/dashboards", { title: "Dashboard" });
};
