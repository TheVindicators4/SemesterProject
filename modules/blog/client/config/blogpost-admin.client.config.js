(function () {
  'use strict';

  // Configuring the blogs Admin module
  angular
    .module('blogpost.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Event Stream',
      state: 'admin.blogpost.list'
    });
  }
}());
