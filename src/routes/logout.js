const router = require("express").Router();
const logoutController = require("../controllers/logout");

// [GET] /
router.get("/", logoutController.index);

module.exports = router;
