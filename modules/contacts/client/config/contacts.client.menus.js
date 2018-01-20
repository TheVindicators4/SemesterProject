(function () {
  'use strict';

  angular
    .module('contacts')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  // configures menu item for contacts page
  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Contacts',
      state: 'contacts',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'contacts', {
      title: 'List Contacts',
      state: 'contacts.list',
      roles: ['*']
    });
  }
}());
