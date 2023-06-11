const message = require("../middlewares/message");
const fs = require('fs-extra')
const path = require("path");
const Promise = require('bluebird');
const Category = Promise.promisifyAll(require("../models/categories"));

//----------------------------------------------Settings----------------------------------------------

// [GET] /settings
exports.settingsIndex = async (req, res, next) => {
    res.locals.config = require("../utils/configs");
    res.render("admin/settings", { title: "Website Settings" });
};

// [POST] /settings
exports.settingsStore = async (req, res, next) => {
    const configs = {
        maintenance: req.body.maintenance ? true : false,
    };
    const configFilePath = path.resolve(__dirname, '../utils/configs.js')
    const fileContent = `module.exports = ${JSON.stringify(configs, null, 2)};`;
    try {
        await fs.writeFile(configFilePath, fileContent);
        delete require.cache[require.resolve('../utils/configs.js')]
        return message.create(req, res, next, "success", "Settings updated successfully.", true, "/admin/settings")
    }
    catch (err) {
        return message.create(req, res, next, "error", "Something went wrong, please try again later.", true, "/admin/settings")
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
    res.render("admin/categories_add", { title: "Add Category" });
};

// [GET] /categories/edit/:id
exports.categoriesEdit = async (req, res, next) => {
    res.locals.category = await Category.findByIdAsync(req.params.id);
    res.render("admin/categories_edit", { title: "Edit Category" });
};

// [GET] /categories/delete/:id
exports.categoriesDelete = async (req, res, next) => {
    res.locals.category = await Category.findByIdAsync(req.params.id);
    res.render("admin/categories_delete", { title: "Delete Category" });
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
    res.render("admin/dashboard", { title: "Dashboard" });
};
