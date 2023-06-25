const message = require("../middlewares/message.js");

// [GET] /
exports.index = async (req, res, next) => {
    try {
        Promise.all([res.clearCookie(process.env.JWT_COOKIE_NAME), redisClient.deleteUser(res.locals.userInfo.id)]);
        message.set(req, res, next, "success", "Logout successfully", true, "/signin")
    }
    catch (err) {
        next(err);
    }
};
