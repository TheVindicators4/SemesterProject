'use strict';

/**
 * Module dependencies
 */
var calendarsPolicy = require('../policies/calendars.server.policy'),
  calendars = require('../controllers/calendars.server.controller');

module.exports = function (app) {
  // Calendars collection routes
  app.route('/api/calendars').all(calendarsPolicy.isAllowed)
    .get(calendars.list)
    .post(calendars.create);

  // Single calendar routes
  app.route('/api/calendars/:calendarId').all(calendarsPolicy.isAllowed)
    .get(calendars.read)
    .put(calendars.update)
    .delete(calendars.delete);

  // Finish by binding the calendar middleware
  app.param('calendarId', calendars.calendarByID);
};
