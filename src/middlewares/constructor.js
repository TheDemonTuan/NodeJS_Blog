module.exports = async (req, res, next) => {
    res.locals.isLogged = false;
    res.locals.userInfo = false;
    res.locals.showMessage = false;
    next();
};