(function () {
  'use strict';

  angular
    .module('aboutmessages')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Aboutmessages',
      state: 'aboutmessages',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'aboutmessages', {
      title: 'List Aboutmessages',
      state: 'aboutmessages.list',
      roles: ['*']
    });
  }
}());
