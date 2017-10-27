(function () {
  'use strict';

  // Configuring the Reviews Admin module
  angular
    .module('reviews.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Reviews',
      state: 'admin.reviews.list'
    });
  }
}());
