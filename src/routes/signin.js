const router = require("express").Router();
const validate = require("../middlewares/validate");
const recaptchaCheck = require("../middlewares/recaptcha");
const signinController = require("../controllers/signin");

router.route("/").get(signinController.index).post(recaptchaCheck.v3, validate.signin, signinController.checkLogin);

module.exports = router;
