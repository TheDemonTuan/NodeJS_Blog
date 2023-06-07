const message = require("../middlewares/message.js");

// [GET] /
exports.index = async (req, res, next) => {
    res.clearCookie("__tdt_token");
    delete req.session.userInfo;
    message.create(req, res, next, "success", "Logout successfully", true, "/signin")
};
