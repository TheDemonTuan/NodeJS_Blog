const router = require("express").Router();
const validate = require("../validation/validate");
const signupController = require("../controllers/signup");

// [GET] /
router.get("/", signupController.index);

// [POST] /
router.post("/", validate.signup, validate.catchErrors, signupController.store);

module.exports = router;
