const message = require("../middlewares/message.js");
const bcrypt = require("bcrypt");
const User = require('../models/users');
const ActivityLog = require('../models/activity_logs');

//----------------------------------------------------PROFILE----------------------------------------------------//

// [GET] /user/profile
exports.profileIndex = async (req, res, next) => {
  res.render('user/profile', { title: 'Profile' });
}

// [POST] /user/profile/change-info
exports.profileInfoUpdate = async (req, res, next) => {
  try {
    let user = await User.findByDisplayName(req.body.displayName);

    if (user && user.displayName !== res.locals.userInfo.displayName)
      return message.set(req, res, next, "error", "Display name already exists", true, '.');

    await Promise.all([User.updateById(res.locals.userInfo.id, new User(req.body, 'updateInfo')), ActivityLog.create(res.locals.userInfo, 'Info Changes', req), redisClient.deleteUserInfo(res.locals.userInfo.id)]);

    message.set(req, res, next, "success", "Update profile successfully", true, '.');
  } catch (err) {
    next(err);
  }
}

// [POST] /user/profile/change-account
exports.profileAccountUpdate = async (req, res, next) => {
  try {
    let result = await Promise.all([User.findByEmail(req.body.email), User.findByUsername(req.body.username)]);

    if (result[0] && result[0].email !== res.locals.userInfo.email)
      return message.set(req, res, next, "error", "Email already exists", true, '.');

    if (result[1] && result[1].username !== res.locals.userInfo.username)
      return message.set(req, res, next, "error", "Username already exists", true, '.');

    if (!bcrypt.compareSync(req.body.confirmPassword, res.locals.userInfo.password))
      return message.set(req, res, next, "error", "Confirm password is incorrect", true, '.');

    await Promise.all([User.updateById(res.locals.userInfo.id, new User(req.body, 'updateAccount')), ActivityLog.create(res.locals.userInfo, 'Account Changes', req), redisClient.deleteUserInfo(res.locals.userInfo.id)]);

    message.set(req, res, next, "success", "Update account successfully", true, '.');
  } catch (err) {
    next(err);
  }
}

// [POST] /user/profile/change-password
exports.profilePasswordUpdate = async (req, res, next) => {
  try {
    if (!bcrypt.compareSync(req.body.currentPassword, res.locals.userInfo.password))
      return message.set(req, res, next, "error", "Current password is incorrect", true, '.');

    await Promise.all([User.updateById(res.locals.userInfo.id, new User({ password: req.body.newPassword }, 'updatePassword')), ActivityLog.create(res.locals.userInfo, 'Password Changes', req), redisClient.deleteUserInfo(res.locals.userInfo.id)]);

    message.set(req, res, next, "success", "Update password successfully", true, '.');
  } catch (err) {
    next(err);
  }
}

//----------------------------------------------------SETTINGS----------------------------------------------------//

// [GET] /user/settings
exports.settingsIndex = async (req, res, next) => {
  res.render('user/settings', { title: 'Settings' });
}

//----------------------------------------------------SECURITY----------------------------------------------------//

// [GET] /user/security
exports.securityIndex = async (req, res, next) => {
  try {
    res.render('user/security', { title: 'Security' });
  } catch (err) {
    next(err);
  }
}

// [POST] /user/security
exports.securityUpdate = async (req, res, next) => {
  // Validate
  if (req.body.activity_mode !== '1' && req.body.activity_mode !== '0')
    return message.set(req, res, next, "error", "Activity logs is invalid", true);

  // Update
  try {
    Promise.all([redisClient.deleteUserInfo(res.locals.userInfo.id), ActivityLog.create(res.locals.userInfo, 'Security Changes', req), User.updateById(res.locals.userInfo.id, { activity_mode: req.body.activity_mode })]);

    message.set(req, res, next, "success", "Update security successfully", true);
  } catch (err) {
    next(err);
  }
}

//----------------------------------------------------ACTIVITY----------------------------------------------------//

// [GET] /user/activity
exports.activityIndex = async (req, res, next) => {
  try {
    res.locals.userActivities = await ActivityLog.getAllFromUserId(res.locals.userInfo.id);
    res.render('user/activity', { title: 'Activity' });
  } catch (err) {
    next(err);
  }
}