'use strict'

const csrf = require('../middlewares/csrf');
const auth = require('../middlewares/auth');
const message = require('../middlewares/message');
const statusCheck = require('../middlewares/status');

module.exports = (app) => {
  // Middleware
  app.use(message.load, auth.token, statusCheck);

  // API V1 Router
  app.use('/api/v1', require('./api'));

  //-----------------Categories-----------------//

  // All-Datapack Router
  app.use('/all-datapacks', require('./all-datapacks'));

  // Datapack Router
  app.use('/datapack', require('./datapack'));

  //-----------------Categories End-----------------//

  // Member Router
  app.use('/member', csrf, require('./member'));

  // User Router
  app.use('/user', csrf, auth.isNotLogged, require('./user'));

  // Admin Router
  app.use('/admin', csrf, auth.isAdmin, require('./admin'))

  // Signup Router
  app.use('/signup', csrf, auth.isLogged, require('./signup'));

  // Signin Router
  app.use('/signin', csrf, auth.isLogged, require('./signin'));

  // Logout Router
  app.use('/logout', csrf, auth.isNotLogged, require('./logout'));

  // Home Router
  app.use('/', require('./home'));

  // Handle Router
  app.use(require('./errors'));

}
