(function (app) {
  'use strict';

  app.registerModule('reviews', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('reviews.admin', ['core.admin']);
  app.registerModule('reviews.admin.routes', ['core.admin.routes']);
  app.registerModule('reviews.services');
  app.registerModule('reviews.routes', ['ui.router', 'core.routes', 'reviews.services']);
}(ApplicationConfiguration));
