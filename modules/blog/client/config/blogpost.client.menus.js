(function () {
  'use strict';

  angular
    .module('blogpost')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Blogpost',
      state: 'blogpost',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'blogpost', {
      title: 'List Blogpost',
      state: 'blogpost.list',
      roles: ['*']
    });
  }
}());
