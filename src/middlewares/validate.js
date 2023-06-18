const { body, validationResult, checkSchema } = require("express-validator");
const message = require("./message.js");

const catchErrors = (req, res, next) => {
  let err = validationResult(req);
  if (!err.isEmpty()) {
    let arr = [];
    if (req.body.email)
      arr["email"] = req.body.email;
    if (req.body.username)
      arr["username"] = req.body.username;
    const query = "?" + Object.entries(arr).map(([key, value]) => `${key}=${value}`).join("&");
    return message.set(req, res, next, "error", err.array()[0].msg, true, `${req.baseUrl}${query}`);
  } else next();
};

exports.signup = [
  checkSchema({
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
        errorMessage: "Email should be at most 50 chars long",
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