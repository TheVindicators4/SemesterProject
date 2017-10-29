(function () {
  'use strict';

  angular
    .module('aboutMessages')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    /*
    menuService.addMenuItem('topbar', {
      title: 'AboutMessages',
      state: 'aboutMessages',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'aboutMessages', {
      title: 'List AboutMessages',
      state: 'aboutMessages.list',
      roles: ['*']
    });
    */
  }
}());
