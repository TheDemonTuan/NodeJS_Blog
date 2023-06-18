const axios = require('axios');
const message = require("./message");

const verifyCaptcha = async (recaptchaResponse,recaptchaSecret) => {

  if (recaptchaResponse === undefined || recaptchaResponse === '' || recaptchaResponse === null) {
    return false;
  }

  const result = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
    params: {
      secret: recaptchaSecret,
      response: recaptchaResponse,
    },
  });

  return result;
}

exports.v2 = async (req, res, next) => {
  const result = await verifyCaptcha(req.body['g-recaptcha-response'],process.env.RECAPTCHA_V2_SECRET_KEY);
  if (result) {
    if (result.data.success && result.data.action === 'signup') {
      next();
    }
    else {
      return message.set(req, res, next, "error", "Captcha not valid", true);
    }
  } else {
    return message.set(req, res, next, "error", "Please check captcha box", true);
  }
};

exports.v3 = async (req, res, next) => {
  const result = await verifyCaptcha(req.body['g-recaptcha-response'],process.env.RECAPTCHA_V3_SECRET_KEY);

  if (result) {
    if (result.data.success && result.data.score >= 0.6 && result.data.action === 'signin') {
      next();
    } else {
      return message.set(req, res, next, "error", "Captcha not valid", true);
    }
  } else {
    return message.set(req, res, next, "error", "Please check captcha box", true);
  }
}