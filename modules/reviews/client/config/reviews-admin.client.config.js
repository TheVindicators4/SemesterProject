(function () {
  'use strict';

  // Configuring the Review Admin module
  angular
    .module('reviews.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Review',
      state: 'admin.review.list'
    });
  }
}());
