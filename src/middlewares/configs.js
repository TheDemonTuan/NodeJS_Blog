const config = require('../utils/configs');
exports.load = ((req, res, next) => {
    if (!res.locals[process.env.SESSION_INFO_NAME].role) {
        if (config.maintenance) 
            return res.render('errors/maintenance');
    }
    next();
})