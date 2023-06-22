const router = require("express").Router();
const apiController = require("../controllers/api");
const { param } = require('express-validator');

router.route("/datapacks/load/:lastId").get(param('page').escape(),apiController.datapackLoad);

module.exports = router;