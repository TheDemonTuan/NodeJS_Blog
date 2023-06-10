const message = require("../middlewares/message");
const fs = require('fs-extra')
const path = require("path");

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
        return message.create(req, res, next, "error", "Something went wrong, please try again later.", true,"/admin/settings")
    }
};

// [GET] /categories
exports.categoriesIndex = async (req, res, next) => {
    res.render("admin/categories", { title: "Categories" });
};

exports.categoriesAdd = async (req, res, next) => {
    res.render("admin/categories-add", { title: "Add Category" });
};

// [GET] /posts
exports.postsIndex = async (req, res, next) => {
    res.render("admin/posts", { title: "Posts" });
};

// [GET] /
exports.dashboardIndex = async (req, res, next) => {
    res.render("admin/dashboard", { title: "Dashboard" });
};
