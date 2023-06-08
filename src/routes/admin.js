const router = require("express").Router();
const adminController = require("../controllers/admin");

// [GET] /dashboard
router.get("/dashboard", adminController.dashboard);

// [GET] /
router.get("/", adminController.dashboard);

module.exports = router;
