(function (app) {
  'use strict';

  app.registerModule('blogposts', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('blogposts.admin', ['core.admin']);
  app.registerModule('blogposts.admin.routes', ['core.admin.routes']);
  app.registerModule('blogposts.services');
  app.registerModule('blogposts.routes', ['ui.router', 'core.routes', 'blogposts.services']);
}(ApplicationConfiguration));
