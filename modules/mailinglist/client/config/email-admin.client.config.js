(function () {
  'use strict';

  // Configuring the Articles Admin module
  angular
    .module('email.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Event Stream',
      state: 'admin.email.list'
    });
  }
}());
