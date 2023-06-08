const router = require("express").Router();
const adminController = require("../controllers/admin");

// [GET] /
router.get("/", adminController.index);

module.exports = router;
