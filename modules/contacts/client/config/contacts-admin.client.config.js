(function () {
  'use strict';

  // Configuring the Contact Admin module
  angular
    .module('contacts.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Contact',
      state: 'admin.contact.list'
    });
  }
}();
