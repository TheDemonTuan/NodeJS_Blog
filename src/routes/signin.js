const router = require("express").Router();
const validate = require("../middlewares/validate");
const signinController = require("../controllers/signin");

// [POST] /
router.post("/", validate.signin, signinController.checkLogin);

// [GET] /
router.get("/", signinController.index);

module.exports = router;
