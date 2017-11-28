(function () {
  'use strict';

  angular
    .module('blogpost.admin')
    .controller('BlogpostAdminListController', BlogpostAdminListController);

  BlogpostAdminListController.$inject = ['BlogpostService'];

  function BlogpostAdminListController(BlogpostService) {
    var vm = this;

    vm.blogpost = BlogpostService.query();
  }
}());
