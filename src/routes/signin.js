const router = require("express").Router();
const validate = require("../middlewares/validate");
const recaptchaCheck = require("../middlewares/recaptcha");
const signinController = require("../controllers/signin");

// [POST] /
router.post("/", recaptchaCheck.v3, validate.signin, signinController.checkLogin);

// [GET] /
router.get("/", signinController.index);

module.exports = router;
