const router = require('express').Router();
const memberController = require('../controllers/member');
const { param } = require("express-validator");

router.route(['/:displayName','/']).get(param('displayName').escape(), memberController.memberDisplay);


module.exports = router