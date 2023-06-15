const axios = require('axios');
const message = require("./message");

exports.v2 = async (req, res, next) => {
  const recaptchaResponse = req.body['g-recaptcha-response'];

  if(recaptchaResponse === undefined || recaptchaResponse === '' || recaptchaResponse === null) {
    // reCAPTCHA không được gửi kèm
    return message.set(req, res, next, "error", "Please check captcha box", true, "/signup");
  }

  // Gửi yêu cầu POST đến API reCAPTCHA
  const result = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
    params: {
      secret: '6LdlzIgjAAAAAFmpQwucpSpq-UaLHntzjvePEoa2',
      response: recaptchaResponse,
    },
  });

  // Kiểm tra kết quả trả về từ API reCAPTCHA
  if (result.data.success) {
    // reCAPTCHA hợp lệ, tiếp tục xử lý yêu cầu
    next();
  } else {
    // reCAPTCHA không hợp lệ
    return message.set(req, res, next, "error", "Captcha not valid", true, "/signup");
  }
};

exports.v3 = async (req, res, next) => {
  const recaptchaResponse = req.body['g-recaptcha-response'];

  if(recaptchaResponse === undefined || recaptchaResponse === '' || recaptchaResponse === null) {
    // reCAPTCHA không được gửi kèm
    return message.set(req, res, next, "error", "Please check captcha box", true, "/signin");
  }

  // Gửi yêu cầu POST đến API reCAPTCHA
  const result = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
    params: {
      secret: '6LeHzKQjAAAAAC_LuaQl9BUUZbWNDqO_lLR2s4Ex',
      response: recaptchaResponse,
    },
  });

  // Kiểm tra kết quả trả về từ API reCAPTCHA
  if (result.data.success && result.data.score >= 0.6 && result.data.action === 'submit') {
    next();
  } else {
    // reCAPTCHA không hợp lệ
    return message.set(req, res, next, "error", "Captcha not valid", true, "/signin");
  }
}