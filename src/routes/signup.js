const router = require("express").Router();
const validate = require("../middlewares/validate");
const recaptchaCheck = require("../middlewares/recaptcha");
const signupController = require("../controllers/signup");

router.route('/submit').post(recaptchaCheck.v2, validate.signup, signupController.store);
router.route("/").get(signupController.index)

module.exports = router;
