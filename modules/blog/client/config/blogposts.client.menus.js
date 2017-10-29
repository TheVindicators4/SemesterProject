(function () {
  'use strict';

  angular
    .module('blogposts')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
	  /*
    menuService.addMenuItem('topbar', {
      title: 'Blogposts',
      state: 'blogposts',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'blogposts', {
      title: 'List Blogposts',
      state: 'blogposts.list',
      roles: ['*']
    });
    */
  }
}());
