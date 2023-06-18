const message = require("../middlewares/message.js");

// [GET] /
exports.index = async (req, res, next) => {
    try {
        await res.clearCookie(process.env.JWT_COOKIE_NAME);
        await _redisClient.del(res.locals.userInfo.id);
        return message.set(req, res, next, "success", "Logout successfully", true, "/signin")
    }
    catch (err) {
        next(err);
    }
};
