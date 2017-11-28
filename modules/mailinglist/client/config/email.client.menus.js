(function () {
  'use strict';

  angular
    .module('email')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Email',
      state: 'email',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'email', {
      title: 'List Email',
      state: 'email.list',
      roles: ['*']
    });
  }
}());
