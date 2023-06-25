const router = require("express").Router();
const validate = require("../middlewares/validate");
const recaptchaCheck = require("../middlewares/recaptcha");
const signinController = require("../controllers/signin");

router.route("/submit").post(recaptchaCheck.v3, validate.signin, signinController.check);
router.route("/").get(signinController.index);

module.exports = router;
