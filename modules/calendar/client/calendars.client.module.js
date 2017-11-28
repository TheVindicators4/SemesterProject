(function (app) {
  'use strict';

  app.registerModule('calendars', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('calendars.admin', ['core.admin']);
  app.registerModule('calendars.admin.routes', ['core.admin.routes']);
  app.registerModule('calendars.services');
  app.registerModule('calendars.routes', ['ui.router', 'core.routes', 'calendars.services']);
}(ApplicationConfiguration));
