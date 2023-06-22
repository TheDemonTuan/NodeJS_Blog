const router = require("express").Router();
const allDatapacksController = require("../controllers/all-datapacks");

router.route("/").get(allDatapacksController.index);

module.exports = router;