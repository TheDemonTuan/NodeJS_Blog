module.exports = async (req, res, next) => {
    // Maintenance mode check
    if (await redisClient.haveMaintenance() && !res.locals.userInfo.role)
        return res.render("errors/maintenance", { title: "Maintenance" });

    // User status check (0 = disabled, 1 = enabled)
    if (res.locals.userInfo.status === 0) {
        whiteListPage = ["/logout"];
        if (!whiteListPage.includes(req.path)) {
            const err = new Error("Your account is disabled, please contact the administrator.");
            err.status = 401;
            return next(err);
        }
    }
    //console.log(req.path)
    next();
};