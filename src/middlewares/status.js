module.exports = async (req, res, next) => {
    if(await _redisClient.exists("maintenance") && !res.locals.userInfo.role)
        return res.render("errors/maintenance", { title: "Maintenance" });
    if(res.locals.userInfo.status === 0)
    {
        const err = new Error("Your account is disabled, please contact the administrator.");
        err.status = 401;
        return next(err);
    }
    next();
};