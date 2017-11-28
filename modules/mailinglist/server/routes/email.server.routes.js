'use strict';

/**
 * Module dependencies
 */
var emailPolicy = require('../policies/email.server.policy'),
  email = require('../controllers/email.server.controller');

module.exports = function (app) {
  // emails collection routes
  app.route('/api/email').all(emailPolicy.isAllowed)
    .get(email.list)
    .post(email.create);

  // Single email routes
  app.route('/api/email/:emailId').all(emailPolicy.isAllowed)
    .get(email.read)
    .put(email.update)
    .delete(email.delete);

  // Finish by binding the email middleware
  app.param('emailId', email.emailByID);
};
