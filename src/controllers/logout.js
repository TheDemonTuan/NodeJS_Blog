const message = require("../middlewares/message.js");

// [GET] /
exports.index = async (req, res, next) => {
    res.clearCookie("token");
    message.create(req, res, next, "success", "Logout successfully", true, "/signin")
};
