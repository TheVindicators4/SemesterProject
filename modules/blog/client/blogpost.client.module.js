(function (app) {
  'use strict';

  app.registerModule('blogpost', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('blogpost.admin', ['core.admin']);
  app.registerModule('blogpost.admin.routes', ['core.admin.routes']);
  app.registerModule('blogpost.services');
  app.registerModule('blogpost.routes', ['ui.router', 'core.routes', 'blogpost.services']);
}(ApplicationConfiguration));
