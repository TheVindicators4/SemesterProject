'use strict';

/**
 * Module dependencies
 */
var eventstreamPolicy = require('../policies/eventstream.server.policy'),
  eventstream = require('../controllers/eventstream.server.controller');

module.exports = function (app) {
  // eventstreams collection routes
  app.route('/api/eventstream').all(eventstreamPolicy.isAllowed)
    .get(eventstream.list)
    .post(eventstream.create);

  // Single eventstream routes
  app.route('/api/eventstream/:eventstreamId').all(eventstreamPolicy.isAllowed)
    .get(eventstream.read)
    .put(eventstream.update)
    .delete(eventstream.delete);

  // Finish by binding the eventstream middleware
  app.param('eventstreamId', eventstream.eventstreamByID);
};
