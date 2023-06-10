const router = require("express").Router();
const validate = require("../middlewares/validate");
const signupController = require("../controllers/signup");

// [POST] /
router.post("/", validate.signup, signupController.store);

// [GET] /
router.get("/", signupController.index);

module.exports = router;
