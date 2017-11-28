(function (app) {
  'use strict';

  app.registerModule('aboutmessages', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('aboutmessages.admin', ['core.admin']);
  app.registerModule('aboutmessages.admin.routes', ['core.admin.routes']);
  app.registerModule('aboutmessages.services');
  app.registerModule('aboutmessages.routes', ['ui.router', 'core.routes', 'aboutmessages.services']);
}(ApplicationConfiguration));
