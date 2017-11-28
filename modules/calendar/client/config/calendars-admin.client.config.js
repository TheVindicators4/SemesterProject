(function () {
  'use strict';

  // Configuring the Calendars Admin module
  angular
    .module('calendars.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    /*
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Calendars',
      state: 'admin.calendars.list'
    });
    */
  }
}());
