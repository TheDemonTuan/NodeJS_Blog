const router = require('express').Router();
const userController = require('../controllers/user');
const avatarUpload = require("../middlewares/user/profile/avatarUpload");
const validate = require("../middlewares/validate");

//----------------------------------------------------PROFILE----------------------------------------------------//
router.route('/profile').get(userController.profileIndex)
router.route('/profile/change-info').post(avatarUpload, validate.profileInfoUpdate, userController.profileInfoUpdate);
router.route('/profile/change-account').post(validate.profileAccountUpdate, userController.profileAccountUpdate);
router.route('/profile/change-password').post(validate.profilePasswordUpdate, userController.profilePasswordUpdate);

//----------------------------------------------------SETTINGS----------------------------------------------------//
router.route('/settings').get(userController.settingsIndex);

//----------------------------------------------------SECURITY----------------------------------------------------//
router.route('/security').get(userController.securityIndex).post(userController.securityUpdate);

//----------------------------------------------------ACTIVITY----------------------------------------------------//
router.route('/activity').get(userController.activityIndex)

module.exports = router;