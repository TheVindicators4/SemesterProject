(function () {
  'use strict';

  angular
    .module('blogposts.admin')
    .controller('BlogpostsAdminListController', BlogpostsAdminListController);

  BlogpostsAdminListController.$inject = ['BlogpostsService'];

  function BlogpostsAdminListController(BlogpostsService) {
    var vm = this;

    vm.blogposts = BlogpostsService.query();
  }
}());
