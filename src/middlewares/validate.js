const { body, validationResult, checkSchema } = require("express-validator");
const message = require("./message.js");

const catchErrors = (req, res, next) => {
  let err = validationResult(req);
  if (!err.isEmpty()) {
    message.set(req, res, next, "error", err.array()[0].msg, true, '.');
  } else
    next();
};

exports.signup = [
  checkSchema({
    displayName: {
      exists: {
        errorMessage: "Display name is required",
      },
      notEmpty: {
        errorMessage: "Display name not empty",
      },
      isLength: {
        errorMessage: "The maximum length of a display name is 30 characters",
        options: { max: 30 },
      },
      escape: true,
      trim: true,
    },
    email: {
      exists: {
        errorMessage: "Email is required",
      },
      notEmpty: {
        errorMessage: "Email not empty",
      },
      isEmail: {
        errorMessage: "Invalid email",
      },
      isLength: {
        options: { max: 50 },
        errorMessage: "The maximum length of a email is 50 characters",
      },
      escape: true,
      trim: true,
    },
    username: {
      exists: {
        errorMessage: "Username is required",
      },
      notEmpty: {
        errorMessage: "Username not empty",
      },
      isLength: {
        errorMessage: "The minimum length of a username is 5 characters and maximum is 20 characters",
        options: { min: 5, max: 20 },
      },
      escape: true,
      trim: true,
    },
    password: {
      notEmpty: {
        errorMessage: "Password is required",
      },
      isLength: {
        errorMessage: "The minimum length of a password is 8 characters",
        options: { min: 8 },
      },
      trim: true,
      escape: true,
    },
    confirmPassword: {
      notEmpty: {
        errorMessage: "Confirm password is required",
      },
      isLength: {
        errorMessage: "The minimum length of a confirm password is 8 characters",
        options: { min: 8 },
      },
      trim: true,
      escape: true,
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error("Confirm password does not match password");
          } else {
            return value;
          }
        },
      },
    },
    check: {
      custom: {
        options: (value, { req }) => {
          if (!req.body.check) {
            throw new Error("Please check the box");
          } else {
            return value;
          }
        }
      }
    }
  }),
  catchErrors
];

exports.signin = [
  checkSchema({
    username: {
      notEmpty: {
        errorMessage: "Username is required",
      },
      isLength: {
        errorMessage:
          "Username should be at least 5 chars long and at most 20 chars long",
        options: { min: 5, max: 20 },
      },
      escape: true,
      trim: true,
    },
    password: {
      notEmpty: {
        errorMessage: "Password is required",
      },
      isLength: {
        errorMessage: "Password should be at least 8 chars long",
        options: { min: 8 },
      },
      trim: true,
    },
  }),
  catchErrors
];

exports.profileInfoUpdate = [
  checkSchema({
    displayName: {
      exists: {
        errorMessage: "Display name is required",
      },
      notEmpty: {
        errorMessage: "Display name not empty",
      },
      isLength: {
        options: { max: 30 },
        errorMessage: "The maximum length of a display name is 30 characters",
      },
      escape: true,
      trim: true,
    },
    description: {
      isLength: {
        options: { max: 300 },
        errorMessage: "The maximum length of a description is 300 characters",
      },
      escape: true,
      trim: true,
    }
  }),
  catchErrors
];

exports.profileAccountUpdate = [
  checkSchema({
    username: {
      exists: {
        errorMessage: "Username is required",
      },
      notEmpty: {
        errorMessage: "Username not empty",
      },
      isLength: {
        errorMessage: "The minimum length of a username is 5 characters and maximum is 20 characters",
        options: { min: 5, max: 20 },
      },
      escape: true,
      trim: true,
    },
    email: {
      exists: {
        errorMessage: "Email is required",
      },
      notEmpty: {
        errorMessage: "Email not empty",
      },
      isEmail: {
        errorMessage: "Invalid email",
      },
      isLength: {
        options: { max: 50 },
        errorMessage: "The maximum length of a email is 50 characters",
      },
      escape: true,
      trim: true,
    },
    confirmPassword: {
      exists: {
        errorMessage: "Confirm password is required",
      },
      notEmpty: {
        errorMessage: "Confirm password not empty",
      },
      isLength: {
        errorMessage: "The minimum length of a confirm password is 8 characters",
        options: { min: 8 },
      },
      trim: true,
      escape: true,
    },
  }),
  catchErrors
];

exports.profilePasswordUpdate = [
  checkSchema({
    currentPassword: {
      exists: {
        errorMessage: "Current password is required",
      },
      notEmpty: {
        errorMessage: "Current password not empty",
      },
      isLength: {
        errorMessage: "The minimum length of a current password is 8 characters",
        options: { min: 8 },
      },
      trim: true,
      escape: true,
    },
    newPassword: {
      exists: {
        errorMessage: "New password is required",
      },
      notEmpty: {
        errorMessage: "New password not empty",
      },
      isLength: {
        errorMessage: "The minimum length of a new password is 8 characters",
        options: { min: 8 },
      },
      trim: true,
      escape: true,
    },
    confirmNewPassword: {
      exists: {
        errorMessage: "Confirm new password is required",
      },
      notEmpty: {
        errorMessage: "Confirm new password not empty",
      },
      isLength: {
        errorMessage: "The minimum length of a confirm new password is 8 characters",
        options: { min: 8 },
      },
      trim: true,
      escape: true,
      custom: {
        options: (value, { req }) => {
          if (value !== req.body["newPassword"]) {
            throw new Error("Confirm new password does not match new password");
          } else {
            return value;
          }
        }
      }
    }
  }),
  catchErrors
];