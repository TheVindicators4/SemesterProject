(function (app) {
  'use strict';

  app.registerModule('shops', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('shops.admin', ['core.admin']);
  app.registerModule('shops.admin.routes', ['core.admin.routes']);
  app.registerModule('shops.services');
  app.registerModule('shops.routes', ['ui.router', 'core.routes', 'shops.services']);
}(ApplicationConfiguration));
