const router = require('express').Router();
const datapackController = require('../controllers/datapack');

router.route('/:slug').get(datapackController.show);

module.exports = router;