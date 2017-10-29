(function () {
  'use strict';

  // Configuring the Blogposts Admin module
  angular
    .module('blogposts.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
	  /*
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Blogposts',
      state: 'admin.articles.list'
    });
    */
  }
}());
