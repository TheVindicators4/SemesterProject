(function () {
  'use strict';

  angular
    .module('calendars')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    /*
    menuService.addMenuItem('topbar', {
      title: 'Calendars',
      state: 'calendars',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'calendars', {
      title: 'List Calendars',
      state: 'calendars.list',
      roles: ['*']
    });
    */
  }
}());
