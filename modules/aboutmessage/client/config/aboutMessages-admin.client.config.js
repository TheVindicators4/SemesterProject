(function () {
  'use strict';

  // Configuring the AboutMessages Admin module
  angular
    .module('aboutMessages.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    /*
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage AboutMessages',
      state: 'admin.aboutMessages.list'
    });
    */
  }
}());
