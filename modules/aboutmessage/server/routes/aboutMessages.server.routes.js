'use strict';

/**
 * Module dependencies
 */
var aboutMessagesPolicy = require('../policies/aboutMessages.server.policy'),
  aboutMessages = require('../controllers/aboutMessages.server.controller');

module.exports = function (app) {
  // AboutMessages collection routes
  app.route('/api/aboutMessages').all(aboutMessagesPolicy.isAllowed)
    .get(aboutMessages.list)
    .post(aboutMessages.create);

  // Single aboutMessage routes
  app.route('/api/aboutMessages/:aboutMessageId').all(aboutMessagesPolicy.isAllowed)
    .get(aboutMessages.read)
    .put(aboutMessages.update)
    .delete(aboutMessages.delete);

  // Finish by binding the aboutMessage middleware
  app.param('aboutMessageId', aboutMessages.aboutMessageByID);
};
