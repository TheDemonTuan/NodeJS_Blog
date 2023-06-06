const router = require("express").Router();
const validate = require("../validation/validate");
const signinController = require("../controllers/signin");

// [POST] /
router.post("/", validate.signin, validate.catchErrors, signinController.checkLogin);

// [GET] /
router.get("/", signinController.index);

module.exports = router;
