module.exports = async (req, res, next) => {
    let pathFilter = req.path;
    while (pathFilter.at(-1) === '/') pathFilter = pathFilter.slice(0, -1);

    res.locals = {
        showMessage: false,
        userInfo: false,
        paths: pathFilter.split('/').filter(path => path !== ''),
        nowPath: pathFilter,
    }
    next();
}