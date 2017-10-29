(function (app) {
  'use strict';

  app.registerModule('eventstream', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('eventstream.admin', ['core.admin']);
  app.registerModule('eventstream.admin.routes', ['core.admin.routes']);
  app.registerModule('eventstream.services');
  app.registerModule('eventstream.routes', ['ui.router', 'core.routes', 'eventstream.services']);
}(ApplicationConfiguration));
