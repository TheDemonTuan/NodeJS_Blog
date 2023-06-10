const rateLimit = require("express-rate-limit");

const configRateLimit = (options) => rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: options.message,
    standardHeaders: false, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: "Too many requests, please try again later.",
    handler: (request, response, next, options) => {
        const error = options.message;
        error.status = 429;
        next(error);
    }
})

exports.signup = configRateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10, 
})

exports.signin = configRateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 15, 
})

exports.all = configRateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 1000, 
})