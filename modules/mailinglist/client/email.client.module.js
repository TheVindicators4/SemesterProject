(function (app) {
  'use strict';

  app.registerModule('email', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('email.admin', ['core.admin']);
  app.registerModule('email.admin.routes', ['core.admin.routes']);
  app.registerModule('email.services');
  app.registerModule('email.routes', ['ui.router', 'core.routes', 'email.services']);
}(ApplicationConfiguration));
