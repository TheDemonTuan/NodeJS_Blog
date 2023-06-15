const router = require("express").Router();
const validate = require("../middlewares/validate");
const recaptchaCheck = require("../middlewares/recaptcha");
const signupController = require("../controllers/signup");

// [POST] /
router.post("/", recaptchaCheck.v2, validate.signup, signupController.store);

// [GET] /
router.get("/", signupController.index);

module.exports = router;
