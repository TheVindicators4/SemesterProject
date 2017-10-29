(function () {
  'use strict';

  angular
    .module('eventstream')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Eventstream',
      state: 'eventstream',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'eventstream', {
      title: 'List Eventstream',
      state: 'eventstream.list',
      roles: ['*']
    });
  }
}());
