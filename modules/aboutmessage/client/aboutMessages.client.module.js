(function (app) {
  'use strict';

  app.registerModule('aboutMessages', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('aboutMessages.admin', ['core.admin']);
  app.registerModule('aboutMessages.admin.routes', ['core.admin.routes']);
  app.registerModule('aboutMessages.services');
  app.registerModule('aboutMessages.routes', ['ui.router', 'core.routes', 'aboutMessages.services']);
}(ApplicationConfiguration));
