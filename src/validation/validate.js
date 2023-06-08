const { body, validationResult, checkSchema } = require("express-validator");
const message = require("../middlewares/message.js");

const catchErrors = (req, res, next) => {
  let err = validationResult(req);
  if (!err.isEmpty()) {
    return message.create(req, res, next, "error", err.array()[0].msg, true);
  } else next();
};

exports.signup = [
  checkSchema({
    email: {
      notEmpty: {
        errorMessage: "Email is required",
      },
      isEmail: {
        errorMessage: "Invalid email",
      },
      isLength: {
        options: { max: 50 },
        errorMessage: "Email should be at most 50 chars long",
      },
      trim: true,
    },
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
    "repeat-password": {
      notEmpty: {
        errorMessage: "Confirm password is required",
      },
      isLength: {
        errorMessage: "Confirm password should be at least 8 chars long",
        options: { min: 8 },
      },
      trim: true,
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
