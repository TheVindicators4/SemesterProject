(function () {
  'use strict';

  // Configuring the Shops Admin module
  angular
    .module('shops.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Shops',
      state: 'admin.articles.list'
    });
  }
}());
