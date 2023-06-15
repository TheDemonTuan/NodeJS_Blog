module.exports = async (req, res, next) => {
    let nowPath = req.path;

    //Remove first and last slash
    if (nowPath[0] == "/")
        nowPath = nowPath.slice(1);
    if (nowPath[nowPath.length - 1] == "/")
        nowPath = nowPath.slice(0, nowPath.length - 1);

    res.locals = {
        showMessage: false,
        userInfo: false,
        path: nowPath.split("/"),
        fullPath: nowPath,
    }
    next();
}