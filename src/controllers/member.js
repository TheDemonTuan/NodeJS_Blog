const User = require('../models/users');

// [GET] /member/:displayName
exports.memberDisplay = async (req, res, next) => {
  try {
    let user;
    if (!req.params.displayName && res.locals.userInfo){
      user = res.locals.userInfo;
    }
    else if(req.params.displayName === res.locals.userInfo.displayName){
      user = res.locals.userInfo;
    }
    else{
      user = await User.findByDisplayName(req.params.displayName);
      if (!user)
        return next();
      else if(!res.locals.userInfo.role)
        {
          user.id = '?';
          user.email = '?';
          user.username = '?';
        }
    };

    res.locals.user = user;
    res.render('member', { title: user.displayName });
  } catch (err) {
    next(err);
  }
}