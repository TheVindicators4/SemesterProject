'use strict';

/**
 * Module dependencies
 */
var aboutmessagesPolicy = require('../policies/aboutmessages.server.policy'),
  aboutmessages = require('../controllers/aboutmessages.server.controller');

module.exports = function (app) {
  // Aboutmessages collection routes
  app.route('/api/aboutmessages').all(aboutmessagesPolicy.isAllowed)
    .get(aboutmessages.list)
    .post(aboutmessages.create);

  // Single aboutmessage routes
  app.route('/api/aboutmessages/:aboutmessageId').all(aboutmessagesPolicy.isAllowed)
    .get(aboutmessages.read)
    .put(aboutmessages.update)
    .delete(aboutmessages.delete);

  // Finish by binding the aboutmessage middleware
  app.param('aboutmessageId', aboutmessages.aboutmessageByID);
};
