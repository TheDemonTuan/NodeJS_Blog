module.exports = (req, res, next) => {
    res.locals = {
        showMessage: false,
        userInfo: false,
    }
    next();
}