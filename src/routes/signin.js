const router = require("express").Router();
const validate = require("../validation/validate");
const signinController = require("../controllers/signin");

// [GET] /
router.get("/", signinController.index);

// [POST] /
router.post("/", validate.signin, validate.errors, signinController.checkLogin);

module.exports = router;
