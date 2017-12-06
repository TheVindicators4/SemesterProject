(function (app) {
  'use strict';

  app.registerModule('contacts', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('contacts.admin', ['core.admin']);
  app.registerModule('contacts.admin.routes', ['core.admin.routes']);
  app.registerModule('contacts.services');
  app.registerModule('contacts.routes', ['ui.router', 'core.routes', 'contacts.services']);
}(ApplicationConfiguration));
