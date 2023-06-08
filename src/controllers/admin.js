// [GET] /
exports.index = async (req, res, next) => {
    res.render("admin/dashboard", { title: "Dashboard" });
};
