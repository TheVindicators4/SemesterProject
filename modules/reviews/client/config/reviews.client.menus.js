(function () {
  'use strict';

  angular
    .module('reviews')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Reviews',
      state: 'reviews',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'reviews', {
      title: 'List Reviews',
      state: 'reviews.list',
      roles: ['*']
    });
  }
}());
