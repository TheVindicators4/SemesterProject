(function () {
  'use strict';

  // Configuring the Aboutmessages Admin module
  angular
    .module('aboutmessages.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Aboutmessages',
      state: 'admin.aboutmessages.list'
    });
  }
}());
