(function () {
  'use strict';

  angular
    .module('blogpost')
    .controller('BlogpostListController', BlogpostListController);

  BlogpostListController.$inject = ['BlogpostService'];

  function BlogpostListController(BlogpostService) {
    var vm = this;

    vm.blogpost = BlogpostService.query();
  }
}());
